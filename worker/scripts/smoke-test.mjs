const base = "http://localhost:8787";

async function main() {
  const createRes = await fetch(`${base}/api/qr`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ destinationUrl: "https://example-a.test" }),
  });
  const created = await createRes.json();
  console.log("CREATE", createRes.status, created);

  const redirectA = await fetch(created.redirectUrl, { redirect: "manual" });
  console.log("REDIRECT A", redirectA.status, redirectA.headers.get("location"));

  const token = created.manageUrl.split("/").pop();
  const updateRes = await fetch(`${base}/api/manage/${created.slug}/${token}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ destinationUrl: "https://example-b.test" }),
  });
  const updated = await updateRes.json();
  console.log("UPDATE", updateRes.status, updated);

  const redirectB = await fetch(created.redirectUrl, { redirect: "manual" });
  console.log("REDIRECT B", redirectB.status, redirectB.headers.get("location"));

  const badUpdate = await fetch(`${base}/api/manage/${created.slug}/bad-token`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ destinationUrl: "https://evil.test" }),
  });
  console.log("BAD TOKEN", badUpdate.status, await badUpdate.json());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
