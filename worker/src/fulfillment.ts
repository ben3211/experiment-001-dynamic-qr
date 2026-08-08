import { randomSlug, randomToken } from "./utils";

export interface EnvUrls {
  apiOrigin: string;
  frontendOrigin: string;
}

export interface FulfillmentResult {
  slug: string;
  destinationUrl: string;
  redirectUrl: string;
  manageUrl: string;
}

interface OrderRow {
  stripe_session_id: string;
  destination_url: string;
  status: string;
  dynamic_qr_slug: string | null;
}

interface QrRow {
  slug: string;
  destination_url: string;
  management_token: string;
}

export async function createPendingOrder(
  db: D1Database,
  stripeSessionId: string,
  destinationUrl: string,
): Promise<void> {
  await db
    .prepare(
      "INSERT INTO checkout_orders (stripe_session_id, destination_url, status) VALUES (?, ?, 'pending')",
    )
    .bind(stripeSessionId, destinationUrl)
    .run();
}

async function getOrder(
  db: D1Database,
  stripeSessionId: string,
): Promise<OrderRow | null> {
  return db
    .prepare(
      "SELECT stripe_session_id, destination_url, status, dynamic_qr_slug FROM checkout_orders WHERE stripe_session_id = ?",
    )
    .bind(stripeSessionId)
    .first<OrderRow>();
}

async function getQrBySlug(
  db: D1Database,
  slug: string,
): Promise<QrRow | null> {
  return db
    .prepare(
      "SELECT slug, destination_url, management_token FROM dynamic_qrs WHERE slug = ?",
    )
    .bind(slug)
    .first<QrRow>();
}

function buildFulfillmentResult(
  qr: QrRow,
  urls: EnvUrls,
): FulfillmentResult {
  return {
    slug: qr.slug,
    destinationUrl: qr.destination_url,
    redirectUrl: `${urls.apiOrigin}/q/${qr.slug}`,
    manageUrl: `${urls.frontendOrigin}/manage/${qr.slug}/${qr.management_token}`,
  };
}

export async function fulfillCheckoutOrder(
  db: D1Database,
  stripeSessionId: string,
  destinationUrl: string,
  urls: EnvUrls,
): Promise<FulfillmentResult> {
  const existingOrder = await getOrder(db, stripeSessionId);
  if (existingOrder?.dynamic_qr_slug) {
    const qr = await getQrBySlug(db, existingOrder.dynamic_qr_slug);
    if (!qr) {
      throw new Error("Stored QR record missing");
    }
    return buildFulfillmentResult(qr, urls);
  }

  const slug = randomSlug();
  const managementToken = randomToken();

  const claim = await db
    .prepare(
      `UPDATE checkout_orders
       SET dynamic_qr_slug = ?, status = 'fulfilled'
       WHERE stripe_session_id = ? AND dynamic_qr_slug IS NULL`,
    )
    .bind(slug, stripeSessionId)
    .run();

  if (claim.meta.changes === 0) {
    const fulfilledOrder = await getOrder(db, stripeSessionId);
    if (!fulfilledOrder?.dynamic_qr_slug) {
      throw new Error("Could not claim checkout order for fulfillment");
    }
    const qr = await getQrBySlug(db, fulfilledOrder.dynamic_qr_slug);
    if (!qr) {
      throw new Error("Stored QR record missing");
    }
    return buildFulfillmentResult(qr, urls);
  }

  await db
    .prepare(
      "INSERT INTO dynamic_qrs (slug, destination_url, management_token) VALUES (?, ?, ?)",
    )
    .bind(slug, destinationUrl, managementToken)
    .run();

  return buildFulfillmentResult(
    {
      slug,
      destination_url: destinationUrl,
      management_token: managementToken,
    },
    urls,
  );
}

export async function markOrderPaid(
  db: D1Database,
  stripeSessionId: string,
): Promise<void> {
  await db
    .prepare(
      "UPDATE checkout_orders SET status = 'paid' WHERE stripe_session_id = ? AND status = 'pending'",
    )
    .bind(stripeSessionId)
    .run();
}
