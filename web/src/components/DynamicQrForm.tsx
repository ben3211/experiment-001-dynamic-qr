import { FormEvent, useState } from "react";
import { startCheckout } from "../api";

export function DynamicQrForm() {
  const [destinationUrl, setDestinationUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { checkoutUrl } = await startCheckout(destinationUrl.trim());
      window.location.href = checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start checkout");
      setLoading(false);
    }
  }

  return (
    <div className="product-panel">
      <div className="info-box">
        <p>
          <strong>Dynamic QR — €4.90 one-time.</strong> Print it once, then
          change where it sends people anytime — no subscription.
        </p>
      </div>

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
          {loading ? "Redirecting to payment…" : "Create dynamic QR — €4.90"}
        </button>
        <p className="form-note">
          Secure payment via Stripe. You&apos;ll receive your QR immediately
          after checkout.
        </p>
      </form>

      {error ? <p className="message error">{error}</p> : null}
    </div>
  );
}
