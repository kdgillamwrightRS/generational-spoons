-- Update hero section image URL to remove "Family Kitchen" text
UPDATE
  site_config
SET
  value = jsonb_set(
    value,
    '{imageUrl}',
    '"https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=1920&h=1080&fit=crop"'
  ),
  updated_at = NOW()
WHERE
  key = 'hero_section';