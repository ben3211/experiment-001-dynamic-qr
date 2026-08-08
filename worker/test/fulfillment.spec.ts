import { env } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import { fulfillCheckoutOrder } from "../src/fulfillment";

describe("fulfillCheckoutOrder", () => {
  it("provisions exactly one QR for repeated fulfillment of the same checkout session", async () => {
    const sessionId = "cs_test_idempotent_001";
    const destinationUrl = "https://example-a.test";

    await env.DB.prepare(
      "INSERT INTO checkout_orders (stripe_session_id, destination_url, status) VALUES (?, ?, 'pending')",
    )
      .bind(sessionId, destinationUrl)
      .run();

    const urls = {
      apiOrigin: "http://localhost:8787",
      frontendOrigin: "http://localhost:5173",
    };

    const first = await fulfillCheckoutOrder(
      env.DB,
      sessionId,
      destinationUrl,
      urls,
    );
    const second = await fulfillCheckoutOrder(
      env.DB,
      sessionId,
      destinationUrl,
      urls,
    );

    expect(first.slug).toBe(second.slug);
    expect(first.manageUrl).toBe(second.manageUrl);

    const count = await env.DB.prepare(
      "SELECT COUNT(*) as count FROM dynamic_qrs WHERE slug = ?",
    )
      .bind(first.slug)
      .first<{ count: number }>();

    expect(count?.count).toBe(1);
  });
});
