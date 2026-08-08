import { FormEvent, useState } from "react";
import { generateQrDataUrl } from "../qr-utils";
import { QrDisplay } from "./QrDisplay";

export function StaticQrForm() {
  const [destinationUrl, setDestinationUrl] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [resolvedDestination, setResolvedDestination] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setQrDataUrl(null);

    const trimmed = destinationUrl.trim();
    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        throw new Error("Please enter a valid website URL (http or https).");
      }

      const qr = await generateQrDataUrl(parsed.href);
      setResolvedDestination(parsed.href);
      setQrDataUrl(qr);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Please enter a valid website URL (http or https).",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="product-panel">
      <div className="info-box">
        <p>
          <strong>Static QR — Free.</strong> The QR links directly to your
          destination. If you change your website later, you must print a new
          QR code.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card form-card">
        <label htmlFor="static-destination">Where should this QR send people?</label>
        <input
          id="static-destination"
          type="url"
          value={destinationUrl}
          onChange={(event) => setDestinationUrl(event.target.value)}
          placeholder="https://your-website.com"
          required
        />
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Generating…" : "Generate static QR"}
        </button>
      </form>

      {error ? <p className="message error">{error}</p> : null}

      {qrDataUrl ? (
        <section className="card result-card">
          <h2>Your static QR</h2>
          <p className="result-lead">
            This QR sends people directly to your destination. It cannot be
            changed after printing.
          </p>

          <QrDisplay
            dataUrl={qrDataUrl}
            alt="Static QR code"
            downloadFilename="static-qr.png"
          />

          <div className="detail-block">
            <span className="detail-label">Destination</span>
            <a href={resolvedDestination} className="detail-value link">
              {resolvedDestination}
            </a>
          </div>
        </section>
      ) : null}
    </div>
  );
}
