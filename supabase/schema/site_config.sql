-- ============================================================================
-- Generational Spoons - Site Configuration Schema
-- ============================================================================
-- This schema stores all site configuration in the database for easy updates
-- without code deployments. Aligns with "Structured Content & Data Integrity"
-- principle from the Constitution.
-- ============================================================================
-- Site Configuration Table
-- Stores key-value pairs for site-wide settings
CREATE TABLE
  IF NOT EXISTS site_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP
    WITH
      TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP
    WITH
      TIME ZONE DEFAULT NOW()
  );


-- Create index for faster key lookups
CREATE INDEX IF NOT EXISTS idx_site_config_key ON site_config(key);


-- Enable Row Level Security (RLS)
ALTER TABLE
  site_config ENABLE ROW LEVEL SECURITY;


-- Policy: Allow public read access (since it's site configuration)
CREATE POLICY "Allow public read access to site_config" ON site_config FOR
SELECT
  TO public USING (true);


-- Policy: Only authenticated users can insert/update (for future admin panel)
CREATE POLICY "Allow authenticated users to modify site_config" ON site_config FOR ALL TO authenticated USING (true)
WITH
  CHECK (true);


-- ============================================================================
-- Seed Data - Initial Site Configuration
-- ============================================================================
-- Hero Section Configuration
INSERT INTO
  site_config (key, value, description)
VALUES
  (
    'hero_section',
    '{
    "heading": "Welcome to Generational Spoons",
    "subheading": "Preserving family recipes, one dish at a time",
    "imageUrl": "https://placehold.co/1920x1080/e2e8f0/1e293b?text=Family+Kitchen&font=roboto",
    "imageAlt": "Family cooking together in a warm kitchen"
  }':: jsonb,
    'Homepage hero section content'
  ) ON CONFLICT (key) DO NOTHING;


-- Navigation Links Configuration
INSERT INTO
  site_config (key, value, description)
VALUES
  (
    'navigation_links',
    '[
    {"label": "Recipes", "href": "/recipes"},
    {"label": "About", "href": "/about"}
  ]':: jsonb,
    'Main navigation menu items'
  ) ON CONFLICT (key) DO NOTHING;


-- Footer Configuration
INSERT INTO
  site_config (key, value, description)
VALUES
  (
    'footer_config',
    '{
    "copyrightYear": 2025,
    "copyrightText": "Created by Kayla Gillam-Wright",
    "socialLinks": [
      {
        "platform": "linkedin",
        "url": "https://www.linkedin.com/in/kayla-gillam-wright",
        "ariaLabel": "LinkedIn profile"
      },
      {
        "platform": "portfolio",
        "url": "https://kaylagw.com",
        "ariaLabel": "Portfolio website"
      }
    ]
  }':: jsonb,
    'Footer configuration including social links'
  ) ON CONFLICT (key) DO NOTHING;


-- Site Metadata Configuration
INSERT INTO
  site_config (key, value, description)
VALUES
  (
    'site_metadata',
    '{
    "title": "Generational Spoons",
    "description": "Preserving family recipes, one dish at a time",
    "keywords": ["recipes", "family", "cooking", "generational"]
  }':: jsonb,
    'Site-wide metadata for SEO'
  ) ON CONFLICT (key) DO NOTHING;


-- ============================================================================
-- Utility Function: Get Config Value
-- ============================================================================
-- Helper function to easily retrieve config values
CREATE
OR REPLACE FUNCTION get_site_config(config_key TEXT) RETURNS JSONB AS $$
SELECT
  value
FROM
  site_config
WHERE
  key = config_key;


$$LANGUAGE SQL STABLE;


-- ============================================================================
-- Notes for Future Enhancements
-- ============================================================================
-- 1. Add versioning: Create site_config_history table to track changes
-- 2. Add caching: Use Supabase edge functions with caching headers
-- 3. Add validation: Create triggers to validate JSONB structure
-- 4. Add preview: Add 'published' boolean to preview changes before going live
-- ============================================================================