import { FormEvent, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getManagedQr, updateManagedQr } from "./api";

export function ManagePage() {
  const { slug, token } = useParams<{ slug: string; token: string }>();
  const [destinationUrl, setDestinationUrl] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!slug || !token) {
      setError("Invalid management URL");
      setLoading(false);
      return;
    }

    getManagedQr(slug, token)
      .then((data) => {
        setDestinationUrl(data.destinationUrl);
        setRedirectUrl(data.redirectUrl);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load QR");
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
      const updated = await updateManagedQr(slug, token, destinationUrl.trim());
      setDestinationUrl(updated.destinationUrl);
      setSavedMessage("Destination updated. The same QR now redirects here.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <main className="page">Loading...</main>;
  }

  if (error && !destinationUrl) {
    return (
      <main className="page">
        <p className="error">{error}</p>
        <Link to="/">Back to create</Link>
      </main>
    );
  }

  return (
    <main className="page">
      <h1>Manage dynamic QR</h1>
      <p className="hint">
        Public redirect URL (unchanged when you edit destination):{" "}
        <a href={redirectUrl}>{redirectUrl}</a>
      </p>

      <form onSubmit={handleSubmit} className="card">
        <label htmlFor="destination">Destination URL</label>
        <input
          id="destination"
          type="url"
          value={destinationUrl}
          onChange={(event) => setDestinationUrl(event.target.value)}
          required
        />
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Update destination"}
        </button>
      </form>

      {savedMessage ? <p className="success">{savedMessage}</p> : null}
      {error ? <p className="error">{error}</p> : null}

      <p>
        <Link to="/">Create another QR</Link>
      </p>
    </main>
  );
}
