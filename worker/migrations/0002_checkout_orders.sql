CREATE TABLE IF NOT EXISTS checkout_orders (
  stripe_session_id TEXT PRIMARY KEY,
  destination_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  dynamic_qr_slug TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_checkout_orders_slug
  ON checkout_orders (dynamic_qr_slug);
