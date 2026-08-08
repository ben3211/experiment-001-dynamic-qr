export interface CreateQrResponse {
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
  const body = (await response.json()) as T & { error?: string };
  if (!response.ok) {
    throw new Error(body.error ?? `Request failed (${response.status})`);
  }
  return body;
}

export async function createDynamicQr(
  destinationUrl: string,
): Promise<CreateQrResponse> {
  const response = await fetch(`${API_BASE}/api/qr`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ destinationUrl }),
  });
  return parseJson<CreateQrResponse>(response);
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
