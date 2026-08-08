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

describe("dynamic QR worker", () => {
  it("creates a QR, redirects, and updates destination with the same slug", async () => {
    const createResponse = await request("/api/qr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ destinationUrl: "https://example-a.test" }),
    });

    expect(createResponse.status).toBe(200);
    const created = (await createResponse.json()) as {
      slug: string;
      redirectUrl: string;
      manageUrl: string;
      destinationUrl: string;
    };

    expect(created.destinationUrl).toBe("https://example-a.test");
    expect(created.redirectUrl).toContain(`/q/${created.slug}`);
    expect(created.manageUrl).toContain(`/manage/${created.slug}/`);

    const redirectResponse = await request(`/q/${created.slug}`, {
      redirect: "manual",
    });
    expect(redirectResponse.status).toBe(302);
    expect(new URL(redirectResponse.headers.get("Location")!).href).toBe(
      new URL("https://example-a.test").href,
    );

    const token = created.manageUrl.split("/").pop()!;
    const manageGet = await request(`/api/manage/${created.slug}/${token}`);
    expect(manageGet.status).toBe(200);
    const manageData = (await manageGet.json()) as { destinationUrl: string };
    expect(manageData.destinationUrl).toBe("https://example-a.test");

    const updateResponse = await request(
      `/api/manage/${created.slug}/${token}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destinationUrl: "https://example-b.test" }),
      },
    );
    expect(updateResponse.status).toBe(200);

    const redirectAgain = await request(`/q/${created.slug}`, {
      redirect: "manual",
    });
    expect(redirectAgain.status).toBe(302);
    expect(new URL(redirectAgain.headers.get("Location")!).href).toBe(
      new URL("https://example-b.test").href,
    );
  });

  it("rejects management updates with an invalid token", async () => {
    const createResponse = await request("/api/qr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ destinationUrl: "https://example.test" }),
    });
    const created = (await createResponse.json()) as { slug: string };

    const updateResponse = await request(
      `/api/manage/${created.slug}/invalid-token`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destinationUrl: "https://other.test" }),
      },
    );

    expect(updateResponse.status).toBe(404);
  });

  it("validates destination URLs on create", async () => {
    const response = await request("/api/qr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ destinationUrl: "not-a-url" }),
    });

    expect(response.status).toBe(400);
  });
});
