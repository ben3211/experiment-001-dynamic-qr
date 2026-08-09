export interface FulfillmentResponse {
  slug: string;
  destinationUrl: string;
  redirectUrl: string;
  manageUrl: string;
}

export interface ManageQrResponse {
  slug: string;
  destinationUrl: string;
  redirectUrl: string;
  createdAt: string;
}

const API_BASE = import.meta.env.VITE_API_BASE ?? "";

async function parseJson<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    throw new Error(
      `Unexpected response from server (${response.status}). Is the Worker running on port 8787?`,
    );
  }

  const body = (await response.json()) as T & { error?: string };
  if (!response.ok) {
    throw new Error(body.error ?? `Request failed (${response.status})`);
  }
  return body;
}

export async function startCheckout(
  destinationUrl: string,
): Promise<{ checkoutUrl: string }> {
  const response = await fetch(`${API_BASE}/api/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ destinationUrl }),
  });
  return parseJson<{ checkoutUrl: string }>(response);
}

export async function getCheckoutFulfillment(
  sessionId: string,
): Promise<FulfillmentResponse> {
  const response = await fetch(
    `${API_BASE}/api/checkout/fulfillment?session_id=${encodeURIComponent(sessionId)}`,
  );
  return parseJson<FulfillmentResponse>(response);
}

export async function getManagedQr(
  slug: string,
  token: string,
): Promise<ManageQrResponse> {
  const response = await fetch(`${API_BASE}/api/manage/${slug}/${token}`);
  return parseJson<ManageQrResponse>(response);
}

export async function updateManagedQr(
  slug: string,
  token: string,
  destinationUrl: string,
): Promise<ManageQrResponse> {
  const response = await fetch(`${API_BASE}/api/manage/${slug}/${token}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ destinationUrl }),
  });
  return parseJson<ManageQrResponse>(response);
}
