import {
  errorResponse,
  isValidHttpUrl,
  jsonResponse,
  randomSlug,
  randomToken,
  withCors,
} from "./utils";

export interface Env {
  DB: D1Database;
  BASE_URL: string;
  FRONTEND_URL: string;
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

async function createDynamicQr(
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

  const slug = randomSlug();
  const managementToken = randomToken();
  const apiOrigin = baseUrl(request, env);
  const frontendOrigin = (env.FRONTEND_URL || apiOrigin).replace(/\/$/, "");

  await env.DB.prepare(
    "INSERT INTO dynamic_qrs (slug, destination_url, management_token) VALUES (?, ?, ?)",
  )
    .bind(slug, destinationUrl, managementToken)
    .run();

  return jsonResponse({
    slug,
    destinationUrl,
    redirectUrl: `${apiOrigin}/q/${slug}`,
    manageUrl: `${frontendOrigin}/manage/${slug}/${managementToken}`,
  });
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

  const apiOrigin = baseUrl(request, env);

  return jsonResponse({
    slug: row.slug,
    destinationUrl: row.destination_url,
    redirectUrl: `${apiOrigin}/q/${row.slug}`,
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
      response = await createDynamicQr(request, env);
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
