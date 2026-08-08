import QRCode from "qrcode";

const QR_OPTIONS = {
  margin: 2,
  width: 280,
  color: {
    dark: "#111111",
    light: "#ffffff",
  },
};

export async function generateQrDataUrl(content: string): Promise<string> {
  return QRCode.toDataURL(content, QR_OPTIONS);
}

export function downloadQrPng(dataUrl: string, filename: string): void {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.click();
}

export async function copyToClipboard(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
}
