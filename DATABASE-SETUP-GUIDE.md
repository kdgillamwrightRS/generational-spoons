# Database Setup Guide

**Project**: Generational Spoons  
**Date**: November 18, 2025  
**Purpose**: Step-by-step guide to set up Supabase database with all required tables

---

## Prerequisites

- [ ] Supabase account created at [supabase.com](https://supabase.com)
- [ ] New Supabase project created (or use existing project)
- [ ] Project credentials saved

---

## Step 1: Get Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

---

## Step 2: Configure Environment Variables

1. Open `.env.local` in the project root
2. Replace placeholder values with your real credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Save the file
4. **IMPORTANT**: Never commit `.env.local` to Git (already in `.gitignore`)

---

## Step 3: Create Database Tables

### A. Run Site Config Schema

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy contents of `supabase/schema/site_config.sql`
4. Paste into SQL Editor
5. Click **Run** (or press Cmd/Ctrl + Enter)

**Expected Result**: 
```
Success. 1 row affected
```

This creates:
- ✅ `site_config` table
- ✅ RLS policies (public read, authenticated write)
- ✅ Indexes for performance
- ✅ 4 configuration rows (hero, navigation, footer, metadata)

**Verify**:
```sql
SELECT key, jsonb_pretty(value) FROM site_config;
```

Should return 4 rows:
- `hero_section`
- `navigation_links`
- `footer_config`
- `site_metadata`

---

### B. Run Recipes Schema

1. In SQL Editor, click **New Query**
2. Copy contents of `supabase/schema/recipes.sql`
3. Paste into SQL Editor
4. Click **Run**

**Expected Result**:
```
Success. 6 rows affected
```

This creates:
- ✅ `recipes` table with JSONB columns
- ✅ Performance indexes (including GIN indexes for JSONB)
- ✅ RLS policies (public read, authenticated write)
- ✅ 6 sample recipes with full directions and ingredients

**Verify**:
```sql
SELECT name, totalTime, ingredientCount, isPopular 
FROM recipes 
ORDER BY viewCount DESC;
```

Should return 6 recipes:
1. Classic Chocolate Chip Cookies (200 views)
2. Homemade Margherita Pizza (180 views)
3. Creamy Chicken Alfredo (165 views)
4. Grandma's Apple Pie (150 views)
5. Classic Caesar Salad (120 views)
6. Sunday Pot Roast (100 views)

---

## Step 4: Test Database Connection

### A. Start Development Server

```bash
npm run dev
```

### B. Check Terminal Output

**Before Database Setup** (expected errors):
```
Error fetching config 'hero_section': Could not find table 'site_config'
Error fetching popular recipes: Could not find table 'recipes'
```

**After Database Setup** (should see no errors or just normal logs):
```
✓ Compiled / in 2.5s
○ Compiling /recipes/[id] ...
✓ Compiled /recipes/[id] in 1.8s
```

### C. Test Homepage

1. Open browser to `http://localhost:3000`
2. Verify you see:
   - ✅ Navigation with "Recipes" and "About" links
   - ✅ Hero section with welcome message
   - ✅ Search bar (interactive)
   - ✅ 6 recipe cards with images, names, times
   - ✅ Footer with social links

### D. Test Recipe Detail Page

1. Click on any recipe card
2. Verify you see:
   - ✅ Recipe name and image
   - ✅ Description
   - ✅ Time, ingredient count, rating
   - ✅ Full ingredients list with amounts and units
   - ✅ Step-by-step directions
   - ✅ Print button
   - ✅ Back to Recipes link

---

## Step 5: Upload Recipe Images (Optional)

The database currently references placeholder image paths. To add real images:

### Option A: Use Supabase Storage

1. In Supabase Dashboard, go to **Storage**
2. Create new bucket: `recipe-images` (public)
3. Upload images:
   - `apple-pie.jpg`
   - `cookies.jpg`
   - `pot-roast.jpg`
   - `margherita-pizza.jpg`
   - `chicken-alfredo.jpg`
   - `caesar-salad.jpg`
   - `hero-image.jpg`

4. Update database image URLs:

```sql
-- Example: Update Apple Pie image
UPDATE recipes 
SET imageUrl = 'https://YOUR_PROJECT_REF.supabase.co/storage/v1/object/public/recipe-images/apple-pie.jpg'
WHERE name = 'Grandma''s Apple Pie';

-- Repeat for other recipes
```

5. Update hero image in site_config:

```sql
UPDATE site_config
SET value = jsonb_set(
  value, 
  '{imageUrl}', 
  '"https://YOUR_PROJECT_REF.supabase.co/storage/v1/object/public/recipe-images/hero-image.jpg"'
)
WHERE key = 'hero_section';
```

### Option B: Use Local Public Folder

1. Add images to `public/images/` directory:
   - `public/images/apple-pie.jpg`
   - `public/images/cookies.jpg`
   - `public/images/pot-roast.jpg`
   - `public/images/margherita-pizza.jpg`
   - `public/images/chicken-alfredo.jpg`
   - `public/images/caesar-salad.jpg`
   - `public/images/hero-image.jpg`

2. Images will automatically work with paths like `/images/apple-pie.jpg`
3. No database changes needed if you use the same filenames

---

## Step 6: Customize Content (Optional)

### Update Hero Section

```sql
UPDATE site_config
SET value = jsonb_set(
  jsonb_set(value, '{heading}', '"Welcome to My Kitchen"'),
  '{subheading}', '"Discover recipes passed down through generations"'
)
WHERE key = 'hero_section';
```

### Add Navigation Link

```sql
UPDATE site_config
SET value = value || '[{"label": "Blog", "href": "/blog"}]'::jsonb
WHERE key = 'navigation_links';
```

### Update Footer Copyright

```sql
UPDATE site_config
SET value = jsonb_set(
  value, 
  '{copyrightText}', 
  '"© 2025 My Kitchen. All rights reserved."'
)
WHERE key = 'footer_config';
```

---

## Troubleshooting

### Error: "Could not find table"

**Cause**: SQL schema not run or wrong database selected

**Fix**:
1. Verify you're in the correct Supabase project
2. Re-run the SQL schema files
3. Check Table Editor to confirm tables exist

---

### Error: "Invalid JWT token"

**Cause**: Wrong anon key or URL in `.env.local`

**Fix**:
1. Double-check credentials from Supabase Dashboard → Settings → API
2. Ensure no extra spaces in `.env.local`
3. Restart dev server: `npm run dev`

---

### Images Not Loading

**Cause**: Image paths incorrect or files missing

**Fix**:
1. Check browser console for 404 errors
2. Verify image files exist in `public/images/`
3. Or upload to Supabase Storage and update URLs

---

### Build Errors

**Cause**: TypeScript type mismatches

**Fix**:
```bash
npm run build
```

Review error messages and ensure:
- All imports use correct paths
- JSONB structure matches TypeScript interfaces
- No 'any' types used

---

## Verification Checklist

After completing all steps, verify:

- [ ] `.env.local` has real Supabase credentials
- [ ] `site_config` table has 4 rows
- [ ] `recipes` table has 6 rows
- [ ] `npm run dev` shows no database errors
- [ ] Homepage loads with recipe cards
- [ ] Clicking recipe card shows detail page
- [ ] Recipe detail shows directions and ingredients
- [ ] Navigation links work
- [ ] Search bar accepts input
- [ ] Footer shows social links
- [ ] `npm run build` succeeds

---

## Next Steps After Setup

1. **Add More Recipes**: Insert into recipes table via SQL or build admin UI
2. **Customize Styles**: Update Tailwind classes in components
3. **Deploy to Vercel**: 
   - Push to GitHub
   - Connect to Vercel
   - Add environment variables in Vercel dashboard
4. **Add Authentication**: Enable auth for recipe submission
5. **Build Admin Panel**: Create `/admin` route to manage recipes

---

## Reference Files

- **SQL Schemas**:
  - `supabase/schema/site_config.sql` - Site configuration table
  - `supabase/schema/recipes.sql` - Recipes with JSONB columns

- **TypeScript Types**:
  - `src/lib/types.ts` - All interfaces

- **Data Layer**:
  - `src/lib/data/config.ts` - Configuration fetching
  - `src/lib/data/recipes.ts` - Recipe fetching

- **Components**:
  - `src/app/recipes/[id]/page.tsx` - Recipe detail page

---

## Support

For issues or questions:
1. Check [Supabase Documentation](https://supabase.com/docs)
2. Review [Next.js App Router Docs](https://nextjs.org/docs/app)
3. Check project README.md
4. Review DATABASE-CONFIG-REFACTORING.md

---

**Database Setup Complete!** 🎉

Your Generational Spoons homepage is now fully database-driven and ready for testing.
