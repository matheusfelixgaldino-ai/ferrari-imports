/*
# Create store_settings table for Ferrari Imports admin configuration

1. New Tables
- `store_settings`: single-row table holding the store's configurable settings as a JSONB column.
  - `id` (int, primary key, always 1 — enforces single-row)
  - `settings` (jsonb, not null) — stores PIX key, beneficiary name, WhatsApp number,
    WhatsApp message, Instagram handle, store name, logo URL, and promotional message.
  - `updated_at` (timestamptz, auto-updated)

2. Security
- Enable RLS on `store_settings`.
- SELECT: public (anon + authenticated) — these are public-facing settings shown to
  all store visitors (PIX key for checkout, WhatsApp number, Instagram link, store name).
- INSERT / UPDATE / DELETE: authenticated only — only logged-in admin users can change settings.
- A trigger keeps `updated_at` current on every update.
*/

CREATE TABLE IF NOT EXISTS store_settings (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now()
);

-- Insert a default empty row if none exists
INSERT INTO store_settings (id, settings)
VALUES (1, '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- Public read: store visitors need to see PIX key, WhatsApp, Instagram, store name
DROP POLICY IF EXISTS "public_read_store_settings" ON store_settings;
CREATE POLICY "public_read_store_settings"
ON store_settings FOR SELECT
TO anon, authenticated USING (true);

-- Only authenticated admin can modify settings
DROP POLICY IF EXISTS "admin_insert_store_settings" ON store_settings;
CREATE POLICY "admin_insert_store_settings"
ON store_settings FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_store_settings" ON store_settings;
CREATE POLICY "admin_update_store_settings"
ON store_settings FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_store_settings" ON store_settings;
CREATE POLICY "admin_delete_store_settings"
ON store_settings FOR DELETE
TO authenticated USING (true);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS store_settings_updated_at ON store_settings;
CREATE TRIGGER store_settings_updated_at
BEFORE UPDATE ON store_settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at();
