-- ============================================================================
-- RECIPES TABLE SCHEMA
-- ============================================================================
-- Purpose: Store recipe data with structured JSONB columns for directions
--          and ingredients to enable full recipe detail pages
-- Created: November 18, 2025
-- Version: 1.0
-- ============================================================================
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ============================================================================
-- TABLE: recipes
-- ============================================================================
CREATE TABLE
  IF NOT EXISTS recipes (
    -- Primary identifier
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- Basic recipe information (required for recipe cards)
    name TEXT NOT NULL,
    imageUrl TEXT NOT NULL,
    totalTime INTEGER NOT NULL,
    -- in minutes
    ingredientCount INTEGER NOT NULL,
    description TEXT,
    -- Short description for recipe cards
    -- Structured recipe data (JSONB for flexibility and queryability)
    directions JSONB NOT NULL,
    -- Array of direction objects: [{"step": 1, "instruction": "..."}]
    full_ingredients JSONB NOT NULL,
    -- Array of ingredient objects: [{"name": "...", "amount": 2, "unit": "cups", "notes": ""}]
    -- Popularity and engagement metrics
    viewCount INTEGER DEFAULT 0,
    rating NUMERIC(3, 2),
    -- e.g., 4.75 (max 5.00)
    isPopular BOOLEAN DEFAULT false,
    -- Timestamps
    createdAt TIMESTAMP
    WITH
      TIME ZONE DEFAULT NOW(),
      updatedAt TIMESTAMP
    WITH
      TIME ZONE DEFAULT NOW()
  );


-- ============================================================================
-- INDEXES
-- ============================================================================
-- Performance indexes for common queries
CREATE INDEX IF NOT EXISTS idx_recipes_viewCount ON recipes(viewCount DESC);


CREATE INDEX IF NOT EXISTS idx_recipes_rating ON recipes(rating DESC);


CREATE INDEX IF NOT EXISTS idx_recipes_isPopular ON recipes(isPopular)
WHERE
  isPopular = true;


CREATE INDEX IF NOT EXISTS idx_recipes_name ON recipes(name);


-- GIN indexes for JSONB columns (enables efficient queries on JSONB data)
-- These allow queries like: WHERE directions @> '[{"step": 1}]'
CREATE INDEX IF NOT EXISTS idx_recipes_directions ON recipes USING GIN (directions);


CREATE INDEX IF NOT EXISTS idx_recipes_full_ingredients ON recipes USING GIN (full_ingredients);


-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================
ALTER TABLE
  recipes ENABLE ROW LEVEL SECURITY;


-- Policy: Allow public read access to all recipes
CREATE POLICY "recipes_public_read" ON recipes FOR
SELECT
  USING (true);


-- Policy: Allow authenticated users to insert new recipes
CREATE POLICY "recipes_authenticated_insert" ON recipes FOR INSERT
WITH
  CHECK (auth.role() = 'authenticated');


-- Policy: Allow authenticated users to update recipes
CREATE POLICY "recipes_authenticated_update" ON recipes FOR
UPDATE
  USING (auth.role() = 'authenticated');


-- Policy: Allow authenticated users to delete recipes
CREATE POLICY "recipes_authenticated_delete" ON recipes FOR DELETE USING (auth.role() = 'authenticated');


-- ============================================================================
-- SAMPLE DATA
-- ============================================================================
-- Insert sample recipes for testing and demonstration
INSERT INTO
  recipes (
    name,
    imageUrl,
    totalTime,
    ingredientCount,
    viewCount,
    rating,
    isPopular,
    description,
    directions,
    full_ingredients
  )
VALUES
  -- Recipe 1: Grandma's Apple Pie
  (
    'Grandma''s Apple Pie',
    'https://placehold.co/800x600/fef3c7/92400e?text=Apple+Pie&font=roboto',
    120,
    8,
    150,
    4.9,
    true,
    'A classic apple pie recipe passed down through generations with a flaky crust and cinnamon-spiced apples',
    '[
      {"step": 1, "instruction": "Preheat oven to 425°F (220°C)"},
      {"step": 2, "instruction": "Mix sliced apples with sugar, cinnamon, and flour in a large bowl"},
      {"step": 3, "instruction": "Place bottom crust in pie pan, add apple mixture"},
      {"step": 4, "instruction": "Cover with top crust, seal edges, and cut vents in the top"},
      {"step": 5, "instruction": "Bake for 45-50 minutes until golden brown and bubbly"}
    ]':: jsonb,
    '[
      {"name": "apples", "amount": 6, "unit": "medium", "notes": "peeled and sliced (Granny Smith or Honeycrisp)"},
      {"name": "granulated sugar", "amount": 0.75, "unit": "cup", "notes": ""},
      {"name": "ground cinnamon", "amount": 1, "unit": "teaspoon", "notes": ""},
      {"name": "all-purpose flour", "amount": 2, "unit": "tablespoons", "notes": "for thickening"},
      {"name": "pie crust", "amount": 2, "unit": "9-inch", "notes": "homemade or store-bought"},
      {"name": "butter", "amount": 1, "unit": "tablespoon", "notes": "cut into small pieces"},
      {"name": "lemon juice", "amount": 1, "unit": "tablespoon", "notes": "fresh"},
      {"name": "egg", "amount": 1, "unit": "large", "notes": "for egg wash"}
    ]':: jsonb
  ),
  -- Recipe 2: Classic Chocolate Chip Cookies
  (
    'Classic Chocolate Chip Cookies',
    'https://placehold.co/800x600/fed7aa/9a3412?text=Chocolate+Cookies&font=roboto',
    45,
    12,
    200,
    4.8,
    true,
    'Soft and chewy chocolate chip cookies that melt in your mouth - a timeless favorite',
    '[
      {"step": 1, "instruction": "Preheat oven to 375°F (190°C) and line baking sheets with parchment paper"},
      {"step": 2, "instruction": "Cream together butter and both sugars until light and fluffy (about 3 minutes)"},
      {"step": 3, "instruction": "Beat in eggs one at a time, then add vanilla extract"},
      {"step": 4, "instruction": "In a separate bowl, whisk together flour, baking soda, and salt"},
      {"step": 5, "instruction": "Gradually mix dry ingredients into wet ingredients until just combined"},
      {"step": 6, "instruction": "Fold in chocolate chips with a spatula"},
      {"step": 7, "instruction": "Drop rounded tablespoons of dough onto baking sheet, 2 inches apart"},
      {"step": 8, "instruction": "Bake for 9-11 minutes until edges are golden but centers still look slightly underdone"},
      {"step": 9, "instruction": "Cool on baking sheet for 5 minutes before transferring to wire rack"}
    ]':: jsonb,
    '[
      {"name": "butter", "amount": 1, "unit": "cup", "notes": "softened (2 sticks)"},
      {"name": "granulated sugar", "amount": 0.75, "unit": "cup", "notes": ""},
      {"name": "brown sugar", "amount": 0.75, "unit": "cup", "notes": "packed"},
      {"name": "eggs", "amount": 2, "unit": "large", "notes": "room temperature"},
      {"name": "vanilla extract", "amount": 2, "unit": "teaspoons", "notes": "pure vanilla"},
      {"name": "all-purpose flour", "amount": 2.25, "unit": "cups", "notes": ""},
      {"name": "baking soda", "amount": 1, "unit": "teaspoon", "notes": ""},
      {"name": "salt", "amount": 1, "unit": "teaspoon", "notes": ""},
      {"name": "chocolate chips", "amount": 2, "unit": "cups", "notes": "semi-sweet"},
      {"name": "walnuts", "amount": 1, "unit": "cup", "notes": "chopped (optional)"}
    ]':: jsonb
  ),
  -- Recipe 3: Sunday Pot Roast
  (
    'Sunday Pot Roast',
    'https://placehold.co/800x600/fecaca/991b1b?text=Pot+Roast&font=roboto',
    240,
    15,
    100,
    4.7,
    true,
    'Tender pot roast with vegetables, perfect for Sunday dinner gatherings',
    '[
      {"step": 1, "instruction": "Preheat oven to 325°F (165°C)"},
      {"step": 2, "instruction": "Pat roast dry and season generously with salt and pepper"},
      {"step": 3, "instruction": "Heat oil in Dutch oven over medium-high heat, sear roast on all sides until browned (about 4 minutes per side)"},
      {"step": 4, "instruction": "Remove roast and set aside. Add onions and garlic to pot, sauté until softened"},
      {"step": 5, "instruction": "Return roast to pot, add beef broth, red wine, tomato paste, and herbs"},
      {"step": 6, "instruction": "Cover with lid and place in oven. Roast for 2 hours"},
      {"step": 7, "instruction": "Add carrots and potatoes, continue roasting for 1 more hour until meat is fork-tender"},
      {"step": 8, "instruction": "Remove from oven, let rest 15 minutes before slicing"},
      {"step": 9, "instruction": "Serve with vegetables and pan sauce"}
    ]':: jsonb,
    '[
      {"name": "chuck roast", "amount": 3, "unit": "pounds", "notes": "boneless"},
      {"name": "onions", "amount": 2, "unit": "large", "notes": "quartered"},
      {"name": "carrots", "amount": 6, "unit": "medium", "notes": "cut into 2-inch chunks"},
      {"name": "potatoes", "amount": 4, "unit": "large", "notes": "quartered (Yukon Gold or Russet)"},
      {"name": "beef broth", "amount": 2, "unit": "cups", "notes": "low-sodium"},
      {"name": "red wine", "amount": 1, "unit": "cup", "notes": "dry red wine (Cabernet or Merlot)"},
      {"name": "garlic", "amount": 4, "unit": "cloves", "notes": "minced"},
      {"name": "tomato paste", "amount": 2, "unit": "tablespoons", "notes": ""},
      {"name": "fresh thyme", "amount": 3, "unit": "sprigs", "notes": ""},
      {"name": "bay leaves", "amount": 2, "unit": "leaves", "notes": ""},
      {"name": "olive oil", "amount": 2, "unit": "tablespoons", "notes": "for searing"},
      {"name": "salt", "amount": 1, "unit": "tablespoon", "notes": "kosher salt"},
      {"name": "black pepper", "amount": 1, "unit": "teaspoon", "notes": "freshly ground"}
    ]':: jsonb
  ),
  -- Recipe 4: Homemade Margherita Pizza
  (
    'Homemade Margherita Pizza',
    'https://placehold.co/800x600/fee2e2/dc2626?text=Margherita+Pizza&font=roboto',
    30,
    7,
    180,
    4.85,
    true,
    'Classic Italian pizza with fresh mozzarella, tomatoes, and basil',
    '[
      {"step": 1, "instruction": "Preheat oven to 500°F (260°C) with pizza stone inside for 30 minutes"},
      {"step": 2, "instruction": "Roll out pizza dough on floured surface to 12-inch circle"},
      {"step": 3, "instruction": "Spread tomato sauce evenly, leaving 1-inch border"},
      {"step": 4, "instruction": "Tear mozzarella and distribute over sauce"},
      {"step": 5, "instruction": "Drizzle with olive oil and season with salt"},
      {"step": 6, "instruction": "Transfer to preheated pizza stone, bake 10-12 minutes until crust is golden"},
      {"step": 7, "instruction": "Remove from oven, top with fresh basil leaves and serve immediately"}
    ]':: jsonb,
    '[
      {"name": "pizza dough", "amount": 1, "unit": "pound", "notes": "homemade or store-bought"},
      {"name": "crushed tomatoes", "amount": 0.5, "unit": "cup", "notes": "San Marzano preferred"},
      {"name": "fresh mozzarella", "amount": 8, "unit": "ounces", "notes": ""},
      {"name": "fresh basil", "amount": 10, "unit": "leaves", "notes": ""},
      {"name": "extra virgin olive oil", "amount": 2, "unit": "tablespoons", "notes": ""},
      {"name": "garlic", "amount": 2, "unit": "cloves", "notes": "minced"},
      {"name": "salt", "amount": 0.5, "unit": "teaspoon", "notes": "sea salt"}
    ]':: jsonb
  ),
  -- Recipe 5: Creamy Chicken Alfredo
  (
    'Creamy Chicken Alfredo',
    'https://placehold.co/800x600/fef9c3/854d0e?text=Chicken+Alfredo&font=roboto',
    35,
    10,
    165,
    4.6,
    true,
    'Rich and creamy fettuccine alfredo with tender grilled chicken',
    '[
      {"step": 1, "instruction": "Cook fettuccine according to package directions, reserve 1 cup pasta water"},
      {"step": 2, "instruction": "Season chicken breasts with salt, pepper, and Italian seasoning"},
      {"step": 3, "instruction": "Grill or pan-fry chicken until cooked through (165°F), about 6-7 minutes per side"},
      {"step": 4, "instruction": "Let chicken rest, then slice into strips"},
      {"step": 5, "instruction": "In large skillet, melt butter over medium heat, add garlic and cook 1 minute"},
      {"step": 6, "instruction": "Add heavy cream, bring to simmer, cook 3 minutes until slightly thickened"},
      {"step": 7, "instruction": "Remove from heat, stir in Parmesan cheese until melted"},
      {"step": 8, "instruction": "Toss pasta with sauce, adding reserved pasta water if needed"},
      {"step": 9, "instruction": "Top with sliced chicken, garnish with parsley and extra Parmesan"}
    ]':: jsonb,
    '[
      {"name": "fettuccine pasta", "amount": 1, "unit": "pound", "notes": ""},
      {"name": "chicken breasts", "amount": 2, "unit": "large", "notes": "boneless, skinless"},
      {"name": "heavy cream", "amount": 2, "unit": "cups", "notes": ""},
      {"name": "butter", "amount": 4, "unit": "tablespoons", "notes": "unsalted"},
      {"name": "Parmesan cheese", "amount": 1.5, "unit": "cups", "notes": "freshly grated"},
      {"name": "garlic", "amount": 4, "unit": "cloves", "notes": "minced"},
      {"name": "Italian seasoning", "amount": 1, "unit": "teaspoon", "notes": ""},
      {"name": "salt", "amount": 1, "unit": "teaspoon", "notes": ""},
      {"name": "black pepper", "amount": 0.5, "unit": "teaspoon", "notes": ""},
      {"name": "fresh parsley", "amount": 2, "unit": "tablespoons", "notes": "chopped for garnish"}
    ]':: jsonb
  ),
  -- Recipe 6: Classic Caesar Salad
  (
    'Classic Caesar Salad',
    'https://placehold.co/800x600/d9f99d/365314?text=Caesar+Salad&font=roboto',
    20,
    9,
    120,
    4.5,
    false,
    'Crisp romaine lettuce with homemade Caesar dressing and croutons',
    '[
      {"step": 1, "instruction": "Make croutons: toss bread cubes with olive oil and bake at 375°F for 10 minutes"},
      {"step": 2, "instruction": "Prepare dressing: whisk together garlic, anchovies, lemon juice, Dijon, and egg yolk"},
      {"step": 3, "instruction": "Slowly drizzle in olive oil while whisking to emulsify"},
      {"step": 4, "instruction": "Stir in Parmesan cheese, season with salt and pepper"},
      {"step": 5, "instruction": "Tear romaine into bite-sized pieces, place in large bowl"},
      {"step": 6, "instruction": "Toss lettuce with dressing until evenly coated"},
      {"step": 7, "instruction": "Top with croutons, extra Parmesan, and black pepper"}
    ]':: jsonb,
    '[
      {"name": "romaine lettuce", "amount": 2, "unit": "heads", "notes": "washed and dried"},
      {"name": "Parmesan cheese", "amount": 0.75, "unit": "cup", "notes": "freshly grated plus extra for serving"},
      {"name": "garlic", "amount": 3, "unit": "cloves", "notes": "minced"},
      {"name": "anchovy fillets", "amount": 4, "unit": "fillets", "notes": ""},
      {"name": "lemon juice", "amount": 3, "unit": "tablespoons", "notes": "fresh"},
      {"name": "Dijon mustard", "amount": 1, "unit": "teaspoon", "notes": ""},
      {"name": "egg yolk", "amount": 1, "unit": "large", "notes": "pasteurized"},
      {"name": "olive oil", "amount": 0.5, "unit": "cup", "notes": "extra virgin"},
      {"name": "bread", "amount": 2, "unit": "cups", "notes": "cubed for croutons"}
    ]':: jsonb
  );


-- ============================================================================
-- VERIFICATION QUERY
-- ============================================================================
-- Run this query to verify the data was inserted correctly
-- SELECT name, totalTime, ingredientCount, isPopular FROM recipes ORDER BY viewCount DESC;
-- ============================================================================
-- JSONB QUERY EXAMPLES
-- ============================================================================
-- Example 1: Find recipes with specific ingredient
-- SELECT name FROM recipes WHERE full_ingredients @> '[{"name": "butter"}]';
-- Example 2: Count steps in each recipe
-- SELECT name, jsonb_array_length(directions) as step_count FROM recipes;
-- Example 3: Get all ingredients for a specific recipe
-- SELECT jsonb_array_elements(full_ingredients) as ingredient FROM recipes WHERE name = 'Grandma''s Apple Pie';