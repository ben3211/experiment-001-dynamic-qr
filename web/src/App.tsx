import { FormEvent, useState } from "react";
import QRCode from "qrcode";
import { createDynamicQr, CreateQrResponse } from "./api";

export function App() {
  const [destinationUrl, setDestinationUrl] = useState("https://example.com");
  const [result, setResult] = useState<CreateQrResponse | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setQrDataUrl(null);

    try {
      const created = await createDynamicQr(destinationUrl.trim());
      const qr = await QRCode.toDataURL(created.redirectUrl, {
        margin: 1,
        width: 256,
      });
      setResult(created);
      setQrDataUrl(qr);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create QR");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <h1>Dynamic QR — Milestone 1</h1>
      <p className="hint">
        Create a QR that points to our redirect URL, not directly to your
        destination.
      </p>

      <form onSubmit={handleSubmit} className="card">
        <label htmlFor="destination">Destination URL</label>
        <input
          id="destination"
          type="url"
          value={destinationUrl}
          onChange={(event) => setDestinationUrl(event.target.value)}
          placeholder="https://example.com"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create dynamic QR"}
        </button>
      </form>

      {error ? <p className="error">{error}</p> : null}

      {result && qrDataUrl ? (
        <section className="card">
          <h2>Your dynamic QR</h2>
          <img src={qrDataUrl} alt="Dynamic QR code" className="qr" />
          <dl>
            <div>
              <dt>Redirect URL (encoded in QR)</dt>
              <dd>
                <a href={result.redirectUrl}>{result.redirectUrl}</a>
              </dd>
            </div>
            <div>
              <dt>Current destination</dt>
              <dd>
                <a href={result.destinationUrl}>{result.destinationUrl}</a>
              </dd>
            </div>
            <div>
              <dt>Private management URL</dt>
              <dd>
                <a href={result.manageUrl}>{result.manageUrl}</a>
              </dd>
            </div>
          </dl>
          <p className="hint">
            Save the management URL. It is the only way to change the
            destination without regenerating the QR.
          </p>
        </section>
      ) : null}
    </main>
  );
}
