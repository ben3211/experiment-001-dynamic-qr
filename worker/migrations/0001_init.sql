CREATE TABLE IF NOT EXISTS dynamic_qrs (
  slug TEXT PRIMARY KEY,
  destination_url TEXT NOT NULL,
  management_token TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_dynamic_qrs_management
  ON dynamic_qrs (slug, management_token);
