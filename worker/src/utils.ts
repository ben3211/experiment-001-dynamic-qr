const SLUG_CHARS = "abcdefghijklmnopqrstuvwxyz0123456789";

export function randomSlug(length = 8): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => SLUG_CHARS[byte % SLUG_CHARS.length]).join("");
}

export function randomToken(bytes = 32): string {
  const buffer = new Uint8Array(bytes);
  crypto.getRandomValues(buffer);
  return Array.from(buffer, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function errorResponse(message: string, status: number): Response {
  return jsonResponse({ error: message }, status);
}

export function withCors(response: Response, origin: string | null): Response {
  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", origin ?? "*");
  headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
