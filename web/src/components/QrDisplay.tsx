import { downloadQrPng } from "../qr-utils";

interface QrDisplayProps {
  dataUrl: string;
  alt: string;
  downloadFilename: string;
  downloadLabel?: string;
}

export function QrDisplay({
  dataUrl,
  alt,
  downloadFilename,
  downloadLabel = "Download QR",
}: QrDisplayProps) {
  return (
    <div className="qr-display">
      <img src={dataUrl} alt={alt} className="qr-image" />
      <button
        type="button"
        className="btn-primary"
        onClick={() => downloadQrPng(dataUrl, downloadFilename)}
      >
        {downloadLabel}
      </button>
    </div>
  );
}
