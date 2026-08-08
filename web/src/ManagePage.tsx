import { FormEvent, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getManagedQr, updateManagedQr } from "./api";
import { Layout } from "./components/Layout";
import { QrDisplay } from "./components/QrDisplay";
import { generateQrDataUrl } from "./qr-utils";

export function ManagePage() {
  const { slug, token } = useParams<{ slug: string; token: string }>();
  const [destinationUrl, setDestinationUrl] = useState("");
  const [newDestination, setNewDestination] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!slug || !token) {
      setError("This management link is not valid.");
      setLoading(false);
      return;
    }

    getManagedQr(slug, token)
      .then(async (data) => {
        setDestinationUrl(data.destinationUrl);
        setNewDestination(data.destinationUrl);
        setRedirectUrl(data.redirectUrl);
        setQrDataUrl(await generateQrDataUrl(data.redirectUrl));
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Could not load QR");
      })
      .finally(() => setLoading(false));
  }, [slug, token]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!slug || !token) {
      return;
    }

    setSaving(true);
    setSavedMessage(null);
    setError(null);

    try {
      const updated = await updateManagedQr(slug, token, newDestination.trim());
      setDestinationUrl(updated.destinationUrl);
      setNewDestination(updated.destinationUrl);
      setSavedMessage(updated.destinationUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save changes");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Layout showHomeLink>
        <p className="loading-text">Loading your QR…</p>
      </Layout>
    );
  }

  if (error && !destinationUrl) {
    return (
      <Layout showHomeLink>
        <div className="card">
          <p className="message error">{error}</p>
          <Link to="/" className="text-link">
            Create a new QR
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showHomeLink>
      <section className="hero compact">
        <h1>Manage your dynamic QR</h1>
        <p className="hero-subtitle">
          Change where your QR sends people. Your printed QR code stays exactly
          the same — no reprint needed.
        </p>
      </section>

      {savedMessage ? (
        <div className="message success-banner" role="status">
          <strong>Saved!</strong> Your QR code is unchanged. It now sends
          people to{" "}
          <a href={savedMessage} className="inline-link">
            {savedMessage}
          </a>
          .
        </div>
      ) : null}

      <div className="manage-grid">
        <section className="card result-card">
          <h2>Your dynamic QR</h2>
          <p className="section-help">
            This is the same QR you printed or downloaded. It does not change
            when you update the destination.
          </p>
          {qrDataUrl ? (
            <QrDisplay
              dataUrl={qrDataUrl}
              alt="Your dynamic QR code"
              downloadFilename="dynamic-qr.png"
            />
          ) : null}
        </section>

        <section className="card result-card">
          <h2>Current destination</h2>
          <p className="section-help">
            Where people go when they scan your QR right now.
          </p>
          <div className="detail-block">
            <a href={destinationUrl} className="detail-value link break">
              {destinationUrl}
            </a>
          </div>

          <form onSubmit={handleSubmit} className="manage-form">
            <label htmlFor="new-destination">New destination</label>
            <input
              id="new-destination"
              type="url"
              value={newDestination}
              onChange={(event) => setNewDestination(event.target.value)}
              placeholder="https://your-new-website.com"
              required
            />
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Saving…" : "Save new destination"}
            </button>
          </form>

          {error ? <p className="message error">{error}</p> : null}

          <p className="reminder">
            After saving, test by scanning your existing QR — it should open
            the new destination. You do not need a new QR code.
          </p>
        </section>
      </div>

      <details className="technical-details">
        <summary>Technical details</summary>
        <p className="muted break">{redirectUrl}</p>
      </details>
    </Layout>
  );
}
