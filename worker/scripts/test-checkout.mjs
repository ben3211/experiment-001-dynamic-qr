const body = JSON.stringify({ destinationUrl: "https://example.com" });

for (const url of [
  "http://127.0.0.1:8787/api/checkout",
  "http://localhost:5173/api/checkout",
]) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
  const text = await response.text();
  console.log(url, response.status, response.headers.get("content-type"));
  console.log(text.slice(0, 200));
  console.log("---");
}
