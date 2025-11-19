# Image Assets for Generational Spoons

## Current Setup: Placeholder Images ✅

All recipe images are currently using **placeholder.co** for demonstration purposes. The database schemas (`supabase/schema/recipes.sql` and `supabase/schema/site_config.sql`) contain URLs to color-coded placeholder images.

**Current Placeholder Images**:
1. **Hero Image** - Gray placeholder (1920x1080)
2. **Apple Pie** - Yellow/brown placeholder (800x600)
3. **Chocolate Cookies** - Orange/brown placeholder (800x600)
4. **Pot Roast** - Red placeholder (800x600)
5. **Margherita Pizza** - Red/pink placeholder (800x600)
6. **Chicken Alfredo** - Yellow placeholder (800x600)
7. **Caesar Salad** - Green placeholder (800x600)

**Benefits of Current Setup**:
- ✅ No image files needed in repository
- ✅ Works immediately after database setup
- ✅ Color-coded for easy identification
- ✅ Proper aspect ratios (4:3 for recipes, 16:9 for hero)
- ✅ Next.js Image optimization configured

---

## Upgrading to Real Images

When you're ready to replace placeholders with real images, you have two options:

### Option 1: Local Images (Simple)

1. Add images to this directory (`public/images/`)
2. Update database URLs to local paths:

```sql
UPDATE recipes 
SET imageUrl = '/images/apple-pie.jpg'
WHERE name = 'Grandma''s Apple Pie';

UPDATE site_config
SET value = jsonb_set(value, '{imageUrl}', '"/images/hero-image.jpg"')
WHERE key = 'hero_section';
```

**Image Specifications**:
- **Format**: JPG, PNG, or WebP
- **Recipe Images**: 800x600px (4:3 aspect ratio)
- **Hero Image**: 1920x1080px (16:9 aspect ratio)
- **File Size**: Keep under 500KB for optimal performance

### Option 2: Supabase Storage (Recommended for Production)

1. **Create Storage Bucket**:
   - In Supabase Dashboard → **Storage**
   - Create bucket: `recipe-images`
   - Make it **public**

2. **Upload Images**:
   - Upload all recipe images and hero image
   - Supabase will generate URLs automatically

3. **Update Database**:

```sql
-- Example for recipe images
UPDATE recipes 
SET imageUrl = 'https://YOUR_PROJECT.supabase.co/storage/v1/object/public/recipe-images/apple-pie.jpg'
WHERE name = 'Grandma''s Apple Pie';

-- Example for hero image
UPDATE site_config
SET value = jsonb_set(
  value, 
  '{imageUrl}', 
  '"https://YOUR_PROJECT.supabase.co/storage/v1/object/public/recipe-images/hero-image.jpg"'
)
WHERE key = 'hero_section';
```

**Benefits**:
- ✅ CDN delivery (faster globally)
- ✅ Automatic image transformations
- ✅ No impact on deployment size
- ✅ Easy management via dashboard
- ✅ Already configured in `next.config.ts`

---

## Image Requirements

### Required Images (When Ready)

Based on the database schema, you'll need:

1. **hero-image.jpg** - Homepage hero section
2. **apple-pie.jpg** - Grandma's Apple Pie
3. **cookies.jpg** - Classic Chocolate Chip Cookies
4. **pot-roast.jpg** - Sunday Pot Roast
5. **margherita-pizza.jpg** - Homemade Margherita Pizza
6. **chicken-alfredo.jpg** - Creamy Chicken Alfredo
7. **caesar-salad.jpg** - Classic Caesar Salad

---

## Finding Quality Food Images

### Free Stock Photo Sources:

1. **Unsplash** - https://unsplash.com/s/photos/food
   - High-quality, free to use
   - Large selection of food photography

2. **Pexels** - https://pexels.com/search/recipe
   - Free for commercial use
   - No attribution required

3. **Pixabay** - https://pixabay.com/images/search/cooking
   - Free images and videos
   - Good variety

### Tips for Selecting Images:

- ✅ Choose well-lit, appetizing photos
- ✅ Prefer close-up shots showing texture and detail
- ✅ Ensure consistent style across all recipes
- ✅ Look for natural lighting (not overly filtered)
- ✅ Check that image is horizontally oriented (4:3 ratio)

---

## Next.js Image Optimization

Next.js automatically optimizes all images:

- ✅ **Lazy loading** - Images load as you scroll
- ✅ **Responsive sizes** - Serves optimal size per device
- ✅ **Modern formats** - Converts to WebP when supported
- ✅ **Blur placeholder** - Shows blur while loading
- ✅ **Priority loading** - Hero image loads immediately

**Configuration** (already set in `next.config.ts`):
```typescript
images: {
  remotePatterns: [
    { hostname: 'placehold.co' },           // Placeholder images
    { hostname: '*.supabase.co' },          // Supabase Storage
  ],
}
```

---

## Testing Without Real Images

The app works perfectly with placeholders - no action needed until you're ready to use real images. The placeholder images:

- Load quickly (served by CDN)
- Show distinct colors for each recipe
- Demonstrate proper aspect ratios
- Allow full functionality testing

---

## Summary

**Current Status**: ✅ Using placeholder images (fully functional)  
**Next Step**: Replace with real images when ready (optional)  
**Configuration**: ✅ Complete - supports local and remote images  
**Image Optimization**: ✅ Automatic via Next.js

No immediate action required - the site works great with placeholders!

