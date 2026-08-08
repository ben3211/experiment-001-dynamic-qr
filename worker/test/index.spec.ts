import {
  env,
  createExecutionContext,
  waitOnExecutionContext,
} from "cloudflare:test";
import { describe, expect, it } from "vitest";
import worker from "../src/index";

const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

async function request(path: string, init?: RequestInit) {
  const request = new IncomingRequest(`http://localhost${path}`, init);
  const ctx = createExecutionContext();
  const response = await worker.fetch(request, env, ctx);
  await waitOnExecutionContext(ctx);
  return response;
}

async function seedDynamicQr(
  slug: string,
  destinationUrl: string,
  managementToken: string,
) {
  await env.DB.prepare(
    "INSERT INTO dynamic_qrs (slug, destination_url, management_token) VALUES (?, ?, ?)",
  )
    .bind(slug, destinationUrl, managementToken)
    .run();
}

describe("dynamic QR worker", () => {
  it("blocks unpaid direct QR creation", async () => {
    const response = await request("/api/qr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ destinationUrl: "https://example-a.test" }),
    });

    expect(response.status).toBe(403);
  });

  it("validates checkout destination input", async () => {
    const response = await request("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ destinationUrl: "not-a-url" }),
    });

    expect(response.status).toBe(400);
  });

  it("redirects and updates destination for an existing QR", async () => {
    const slug = "testslug";
    const token = "a".repeat(64);

    await seedDynamicQr(slug, "https://example-a.test", token);

    const redirectResponse = await request(`/q/${slug}`, {
      redirect: "manual",
    });
    expect(redirectResponse.status).toBe(302);
    expect(new URL(redirectResponse.headers.get("Location")!).href).toBe(
      new URL("https://example-a.test").href,
    );

    const updateResponse = await request(`/api/manage/${slug}/${token}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ destinationUrl: "https://example-b.test" }),
    });
    expect(updateResponse.status).toBe(200);

    const redirectAgain = await request(`/q/${slug}`, {
      redirect: "manual",
    });
    expect(redirectAgain.status).toBe(302);
    expect(new URL(redirectAgain.headers.get("Location")!).href).toBe(
      new URL("https://example-b.test").href,
    );
  });

  it("rejects management updates with an invalid token", async () => {
    await seedDynamicQr("badtokentest", "https://example.test", "validtoken");

    const updateResponse = await request(
      "/api/manage/badtokentest/invalid-token",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destinationUrl: "https://other.test" }),
      },
    );

    expect(updateResponse.status).toBe(404);
  });

  it("rejects fulfillment without a completed payment", async () => {
    const response = await request(
      "/api/checkout/fulfillment?session_id=cs_test_unpaid",
    );

    expect([402, 503]).toContain(response.status);
  });
});
