import { FormEvent, useState } from "react";
import { createDynamicQr, CreateQrResponse } from "../api";
import { generateQrDataUrl } from "../qr-utils";
import { CopyButton } from "./CopyButton";
import { QrDisplay } from "./QrDisplay";

export function DynamicQrForm() {
  const [destinationUrl, setDestinationUrl] = useState("");
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
      const qr = await generateQrDataUrl(created.redirectUrl);
      setResult(created);
      setQrDataUrl(qr);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create QR");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="product-panel">
      <div className="info-box">
        <p>
          <strong>Dynamic QR — €4.90 one-time.</strong> Print it once, then
          change where it sends people anytime — no subscription.{" "}
          <span className="muted">
            Payment is not live yet; you can test creation locally.
          </span>
        </p>
      </div>

      {!result ? (
        <form onSubmit={handleSubmit} className="card form-card">
          <label htmlFor="dynamic-destination">
            Where should this QR send people first?
          </label>
          <input
            id="dynamic-destination"
            type="url"
            value={destinationUrl}
            onChange={(event) => setDestinationUrl(event.target.value)}
            placeholder="https://your-website.com"
            required
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Creating…" : "Create dynamic QR"}
          </button>
        </form>
      ) : null}

      {error ? <p className="message error">{error}</p> : null}

      {result && qrDataUrl ? (
        <section className="card result-card">
          <h2>Your dynamic QR is ready</h2>
          <p className="result-lead highlight">
            <strong>The QR stays the same.</strong> You change where it sends
            people — no need to reprint.
          </p>

          <div className="result-section">
            <h3>1. Your dynamic QR</h3>
            <p className="section-help">
              Print or share this code. It never changes, even when you update
              the destination.
            </p>
            <QrDisplay
              dataUrl={qrDataUrl}
              alt="Dynamic QR code"
              downloadFilename="dynamic-qr.png"
            />
          </div>

          <div className="result-section">
            <h3>2. Current destination</h3>
            <p className="section-help">
              This is the website people reach when they scan your QR right
              now.
            </p>
            <div className="detail-block">
              <a href={result.destinationUrl} className="detail-value link">
                {result.destinationUrl}
              </a>
            </div>
          </div>

          <div className="result-section important">
            <h3>3. Private management link</h3>
            <p className="section-help">
              Save this link somewhere safe. It is the only way to change your
              destination later. We cannot recover it for you.
            </p>
            <div className="link-row">
              <a href={result.manageUrl} className="detail-value link break">
                {result.manageUrl}
              </a>
              <CopyButton text={result.manageUrl} label="Copy link" />
            </div>
            <p className="next-step">
              To change the destination later, open this management link — not
              the QR, and not the destination URL above.
            </p>
          </div>

          <button
            type="button"
            className="btn-text"
            onClick={() => {
              setResult(null);
              setQrDataUrl(null);
              setDestinationUrl("");
            }}
          >
            Create another dynamic QR
          </button>
        </section>
      ) : null}
    </div>
  );
}
