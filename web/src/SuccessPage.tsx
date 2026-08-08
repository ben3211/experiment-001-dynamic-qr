import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FulfillmentResponse, getCheckoutFulfillment } from "./api";
import { Layout } from "./components/Layout";
import { DynamicQrResult } from "./components/DynamicQrResult";
import { generateQrDataUrl } from "./qr-utils";

export function SuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [result, setResult] = useState<FulfillmentResponse | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      setError("Missing checkout session.");
      setLoading(false);
      return;
    }

    getCheckoutFulfillment(sessionId)
      .then(async (fulfillment) => {
        setResult(fulfillment);
        setQrDataUrl(await generateQrDataUrl(fulfillment.redirectUrl));
      })
      .catch((err) => {
        setError(
          err instanceof Error ? err.message : "Could not load your QR yet",
        );
      })
      .finally(() => setLoading(false));
  }, [sessionId]);

  if (loading) {
    return (
      <Layout showHomeLink>
        <p className="loading-text">Confirming your payment…</p>
      </Layout>
    );
  }

  if (error || !result || !qrDataUrl) {
    return (
      <Layout showHomeLink>
        <div className="card">
          <p className="message error">
            {error ?? "We could not deliver your QR."}
          </p>
          <p className="section-help">
            If you completed payment, wait a moment and refresh this page.
          </p>
          <Link to="/" className="text-link">
            Back to home
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showHomeLink>
      <section className="hero compact">
        <h1>Payment complete</h1>
        <p className="hero-subtitle">
          Your dynamic QR is ready to download and use.
        </p>
      </section>

      <DynamicQrResult result={result} qrDataUrl={qrDataUrl} />
    </Layout>
  );
}
