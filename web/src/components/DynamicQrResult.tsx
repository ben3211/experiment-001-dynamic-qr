import { FulfillmentResponse } from "../api";
import { CopyButton } from "./CopyButton";
import { QrDisplay } from "./QrDisplay";

interface DynamicQrResultProps {
  result: FulfillmentResponse;
  qrDataUrl: string;
  onCreateAnother?: () => void;
}

export function DynamicQrResult({
  result,
  qrDataUrl,
  onCreateAnother,
}: DynamicQrResultProps) {
  return (
    <section className="card result-card">
      <h2>Your dynamic QR is ready</h2>
      <p className="result-lead highlight">
        <strong>The QR stays the same.</strong> You can change where it sends
        people later — no need to reprint.
      </p>

      <div className="result-section">
        <h3>1. Your dynamic QR</h3>
        <p className="section-help">
          Print or share this code. It never changes, even when you update the
          destination.
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
          This is the website people reach when they scan your QR right now.
        </p>
        <div className="detail-block">
          <a href={result.destinationUrl} className="detail-value link break">
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
          To change the destination later, open this management link — not the
          QR, and not the destination URL above.
        </p>
      </div>

      {onCreateAnother ? (
        <button type="button" className="btn-text" onClick={onCreateAnother}>
          Create another dynamic QR
        </button>
      ) : null}
    </section>
  );
}
