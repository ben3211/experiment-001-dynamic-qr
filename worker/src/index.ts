import {
  createPendingOrder,
  fulfillCheckoutOrder,
  markOrderPaid,
} from "./fulfillment";
import {
  createCheckoutSession,
  getStripe,
  retrievePaidCheckoutSession,
  verifyWebhookEvent,
} from "./stripe-client";
import {
  errorResponse,
  isValidHttpUrl,
  jsonResponse,
  withCors,
} from "./utils";

export interface Env {
  DB: D1Database;
  BASE_URL: string;
  FRONTEND_URL: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
}

interface DynamicQrRow {
  slug: string;
  destination_url: string;
  management_token: string;
  created_at: string;
}

function baseUrl(request: Request, env: Env): string {
  if (env.BASE_URL && env.BASE_URL !== "http://localhost:8787") {
    return env.BASE_URL.replace(/\/$/, "");
  }

  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}

function frontendUrl(env: Env): string {
  return (env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");
}

function envUrls(request: Request, env: Env) {
  return {
    apiOrigin: baseUrl(request, env),
    frontendOrigin: frontendUrl(env),
  };
}

function requireStripe(env: Env): Response | null {
  if (!env.STRIPE_SECRET_KEY) {
    return errorResponse("Payment is not configured", 503);
  }
  return null;
}

async function startCheckout(
  request: Request,
  env: Env,
): Promise<Response> {
  let body: { destinationUrl?: string };
  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid JSON body", 400);
  }

  const destinationUrl = body.destinationUrl?.trim();
  if (!destinationUrl || !isValidHttpUrl(destinationUrl)) {
    return errorResponse("destinationUrl must be a valid http(s) URL", 400);
  }

  const configError = requireStripe(env);
  if (configError) {
    return configError;
  }

  const stripe = getStripe(env.STRIPE_SECRET_KEY!);
  const frontendOrigin = frontendUrl(env);

  try {
    const session = await createCheckoutSession(stripe, {
      destinationUrl,
      successUrl: `${frontendOrigin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${frontendOrigin}/?cancelled=1`,
    });

    await createPendingOrder(env.DB, session.id, destinationUrl);

    if (!session.url) {
      return errorResponse("Could not start checkout", 500);
    }

    return jsonResponse({ checkoutUrl: session.url });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not start checkout";
    console.error("Checkout session creation failed:", message);
    return errorResponse("Could not start checkout. Please try again.", 502);
  }
}

async function getCheckoutFulfillment(
  request: Request,
  env: Env,
): Promise<Response> {
  const configError = requireStripe(env);
  if (configError) {
    return configError;
  }

  const sessionId = new URL(request.url).searchParams.get("session_id")?.trim();
  if (!sessionId) {
    return errorResponse("session_id is required", 400);
  }

  const stripe = getStripe(env.STRIPE_SECRET_KEY!);

  let session;
  try {
    session = await retrievePaidCheckoutSession(stripe, sessionId);
  } catch {
    return errorResponse("Payment not completed", 402);
  }

  if (!session) {
    return errorResponse("Payment not completed", 402);
  }

  const destinationUrl = session.metadata?.destination_url?.trim();
  if (!destinationUrl || !isValidHttpUrl(destinationUrl)) {
    return errorResponse("Checkout session is invalid", 400);
  }

  await markOrderPaid(env.DB, session.id);
  const result = await fulfillCheckoutOrder(
    env.DB,
    session.id,
    destinationUrl,
    envUrls(request, env),
  );

  return jsonResponse(result);
}

async function handleStripeWebhook(
  request: Request,
  env: Env,
): Promise<Response> {
  if (!env.STRIPE_SECRET_KEY || !env.STRIPE_WEBHOOK_SECRET) {
    return errorResponse("Webhook is not configured", 503);
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return errorResponse("Missing Stripe signature", 400);
  }

  const payload = await request.text();
  const stripe = getStripe(env.STRIPE_SECRET_KEY);

  let event;
  try {
    event = verifyWebhookEvent(
      stripe,
      payload,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch {
    return errorResponse("Invalid Stripe signature", 400);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as {
      id: string;
      payment_status: string;
      metadata?: { destination_url?: string };
    };

    if (session.payment_status === "paid") {
      const destinationUrl = session.metadata?.destination_url?.trim();
      if (destinationUrl && isValidHttpUrl(destinationUrl)) {
        await markOrderPaid(env.DB, session.id);
        await fulfillCheckoutOrder(
          env.DB,
          session.id,
          destinationUrl,
          envUrls(request, env),
        );
      }
    }
  }

  return jsonResponse({ received: true });
}

async function redirectQr(slug: string, env: Env): Promise<Response> {
  const row = await env.DB.prepare(
    "SELECT destination_url FROM dynamic_qrs WHERE slug = ?",
  )
    .bind(slug)
    .first<{ destination_url: string }>();

  if (!row) {
    return errorResponse("QR not found", 404);
  }

  return Response.redirect(row.destination_url, 302);
}

async function getManagedQr(
  slug: string,
  token: string,
  request: Request,
  env: Env,
): Promise<Response> {
  const row = await env.DB.prepare(
    "SELECT slug, destination_url, created_at FROM dynamic_qrs WHERE slug = ? AND management_token = ?",
  )
    .bind(slug, token)
    .first<Pick<DynamicQrRow, "slug" | "destination_url" | "created_at">>();

  if (!row) {
    return errorResponse("Not found or invalid management token", 404);
  }

  const urls = envUrls(request, env);

  return jsonResponse({
    slug: row.slug,
    destinationUrl: row.destination_url,
    redirectUrl: `${urls.apiOrigin}/q/${row.slug}`,
    createdAt: row.created_at,
  });
}

async function updateManagedQr(
  slug: string,
  token: string,
  request: Request,
  env: Env,
): Promise<Response> {
  let body: { destinationUrl?: string };
  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid JSON body", 400);
  }

  const destinationUrl = body.destinationUrl?.trim();
  if (!destinationUrl || !isValidHttpUrl(destinationUrl)) {
    return errorResponse("destinationUrl must be a valid http(s) URL", 400);
  }

  const result = await env.DB.prepare(
    "UPDATE dynamic_qrs SET destination_url = ? WHERE slug = ? AND management_token = ?",
  )
    .bind(destinationUrl, slug, token)
    .run();

  if (result.meta.changes === 0) {
    return errorResponse("Not found or invalid management token", 404);
  }

  return jsonResponse({ slug, destinationUrl });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin");

    if (request.method === "OPTIONS") {
      return withCors(new Response(null, { status: 204 }), origin);
    }

    let response: Response;

    if (request.method === "POST" && url.pathname === "/api/qr") {
      response = errorResponse(
        "Direct QR creation is disabled. Complete checkout to create a dynamic QR.",
        403,
      );
    } else if (request.method === "POST" && url.pathname === "/api/checkout") {
      response = await startCheckout(request, env);
    } else if (
      request.method === "GET" &&
      url.pathname === "/api/checkout/fulfillment"
    ) {
      response = await getCheckoutFulfillment(request, env);
    } else if (
      request.method === "POST" &&
      url.pathname === "/api/stripe/webhook"
    ) {
      response = await handleStripeWebhook(request, env);
    } else if (request.method === "GET" && url.pathname.startsWith("/q/")) {
      const slug = url.pathname.slice("/q/".length);
      if (!slug || slug.includes("/")) {
        response = errorResponse("Invalid slug", 400);
      } else {
        response = await redirectQr(slug, env);
      }
    } else if (
      request.method === "GET" &&
      url.pathname.startsWith("/api/manage/")
    ) {
      const parts = url.pathname.slice("/api/manage/".length).split("/");
      if (parts.length !== 2 || !parts[0] || !parts[1]) {
        response = errorResponse("Invalid management path", 400);
      } else {
        response = await getManagedQr(parts[0], parts[1], request, env);
      }
    } else if (
      request.method === "PUT" &&
      url.pathname.startsWith("/api/manage/")
    ) {
      const parts = url.pathname.slice("/api/manage/".length).split("/");
      if (parts.length !== 2 || !parts[0] || !parts[1]) {
        response = errorResponse("Invalid management path", 400);
      } else {
        response = await updateManagedQr(parts[0], parts[1], request, env);
      }
    } else {
      response = errorResponse("Not found", 404);
    }

    if (url.pathname.startsWith("/api/")) {
      return withCors(response, origin);
    }

    return response;
  },
};
