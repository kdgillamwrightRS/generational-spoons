# Generational Spoons Homepage - Technical Implementation Plan

**Version**: 1.0  
**Created**: November 18, 2025  
**Status**: Ready for Implementation  
**Priority**: Supabase JavaScript Client + TypeScript + Next.js App Router

---

## 1. Overview

This technical plan outlines the step-by-step implementation of the Generational Spoons Homepage, with **primary focus on Supabase JavaScript client integration** for data fetching in Next.js Server Components using the App Router pattern.

### 1.1 Core Technologies
- **Next.js 16.0.3** (App Router)
- **React 19.2.0** (Server Components by default)
- **TypeScript 5.x** (Strict mode)
- **Supabase JavaScript Client 2.82.0**
- **Tailwind CSS 4.x**

### 1.2 Implementation Phases
1. **Phase 1**: TypeScript Types & Supabase Setup
2. **Phase 2**: Data Fetching Layer
3. **Phase 3**: Core Components (Server Components)
4. **Phase 4**: Interactive Components (Client Components)
5. **Phase 5**: Layout & Styling
6. **Phase 6**: Testing & Optimization

---

## 2. Phase 1: TypeScript Types & Supabase Setup

### 2.1 Create Centralized Type Definitions

**File**: `src/lib/types.ts`

```typescript
// Recipe type matching Supabase schema and Spec Section 3.3.8
export interface Recipe {
  id: string;
  name: string;
  imageUrl: string;
  totalTime: number; // in minutes
  ingredientCount: number;
}

// Recipe direction step structure (from JSONB)
export interface RecipeDirection {
  step: number;
  instruction: string;
}

// Recipe ingredient structure (from JSONB)
export interface RecipeIngredient {
  name: string;
  amount: number;
  unit: string;
  notes: string;
}

// Extended Recipe type for database (optional fields)
export interface RecipeDatabase extends Recipe {
  description?: string;
  viewCount?: number;
  rating?: number;
  isPopular?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Full recipe detail including JSONB fields
export interface RecipeDetail extends Recipe {
  description: string;
  directions: RecipeDirection[];
  full_ingredients: RecipeIngredient[];
  viewCount?: number;
  rating?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Props for components
export interface RecipeCardProps {
  recipe: Recipe;
}

export interface PopularRecipesSectionProps {
  limit?: number; // Default: 6
}

export interface HeroSectionProps {
  heroImage: {
    src: string;
    alt: string;
  };
  welcomeMessage: {
    heading: string;
    subheading: string;
  };
}

export interface FooterProps {
  copyrightYear?: number;
  socialLinks: SocialLink[];
}

export interface SocialLink {
  platform: 'linkedin' | 'portfolio';
  url: string;
  ariaLabel: string;
}

export interface NavigationLink {
  label: string;
  href: string;
}
```

**Action Items**:
- ✅ Create `src/lib/types.ts`
- ✅ Define all interfaces from Spec Section 3.3.8 and component sections
- ✅ Export all types for use across application

---

## 3. Phase 2: Data Fetching Layer (PRIORITY)

### 3.1 Supabase Client Configuration

**Current State**: `src/app/lib/supabase.ts` exists but uses client-side pattern

**Issue**: Current implementation exposes environment variables to client-side
**Solution**: Create server-side Supabase client for Server Components

**File**: `src/lib/supabase/server.ts` (NEW)

```typescript
import { createClient } from '@supabase/supabase-js';
import { Recipe, RecipeDatabase } from '@/lib/types';

// Server-side Supabase client (uses service role or anon key server-side)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create typed Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

**File**: `src/lib/supabase/client.ts` (MOVE EXISTING)

```typescript
// Client-side Supabase client (for future client components if needed)
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 3.2 Recipe Data Fetching Functions

**File**: `src/lib/data/recipes.ts` (NEW - PRIMARY FOCUS)

This file demonstrates **Supabase JavaScript client usage** as specified in Spec Section 3.3.4.

```typescript
import { supabase } from '@/lib/supabase/server';
import { Recipe } from '@/lib/types';

/**
 * Fetch popular recipes from Supabase
 * 
 * This function demonstrates Supabase JavaScript client usage in a Next.js Server Component
 * context, as required by Spec Section 3.3.4.
 * 
 * @param limit - Number of recipes to fetch (default: 6)
 * @returns Array of Recipe objects with required fields
 */
export async function getPopularRecipes(limit: number = 6): Promise<Recipe[]> {
  try {
    // Supabase query as specified in Spec Section 4.2
    const { data, error } = await supabase
      .from('recipes')
      .select('id, name, imageUrl, totalTime, ingredientCount')
      .order('viewCount', { ascending: false })
      .limit(limit);

    // Error handling
    if (error) {
      console.error('Error fetching popular recipes:', error);
      throw new Error(`Failed to fetch popular recipes: ${error.message}`);
    }

    // Data validation and type safety
    if (!data) {
      return [];
    }

    // Return properly typed data
    return data as Recipe[];
    
  } catch (error) {
    console.error('Unexpected error in getPopularRecipes:', error);
    // Return empty array for graceful degradation
    return [];
  }
}

/**
 * Alternative: Fetch recipes by manual curation flag
 * 
 * @param limit - Number of recipes to fetch
 * @returns Array of Recipe objects
 */
export async function getCuratedPopularRecipes(limit: number = 6): Promise<Recipe[]> {
  try {
    const { data, error } = await supabase
      .from('recipes')
      .select('id, name, imageUrl, totalTime, ingredientCount')
      .eq('isPopular', true)
      .limit(limit);

    if (error) {
      console.error('Error fetching curated recipes:', error);
      return [];
    }

    return (data as Recipe[]) || [];
    
  } catch (error) {
    console.error('Unexpected error in getCuratedPopularRecipes:', error);
    return [];
  }
}

/**
 * Alternative: Fetch recipes by rating
 * 
 * @param limit - Number of recipes to fetch
 * @returns Array of Recipe objects
 */
export async function getTopRatedRecipes(limit: number = 6): Promise<Recipe[]> {
  try {
    const { data, error } = await supabase
      .from('recipes')
      .select('id, name, imageUrl, totalTime, ingredientCount')
      .order('rating', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching top rated recipes:', error);
      return [];
    }

    return (data as Recipe[]) || [];
    
  } catch (error) {
    console.error('Unexpected error in getTopRatedRecipes:', error);
    return [];
  }
}

/**
 * Fetch a single recipe by ID
 * 
 * @param id - Recipe ID
 * @returns Recipe object or null
 */
export async function getRecipeById(id: string): Promise<Recipe | null> {
  try {
    const { data, error } = await supabase
      .from('recipes')
      .select('id, name, imageUrl, totalTime, ingredientCount')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching recipe ${id}:`, error);
      return null;
    }

    return data as Recipe;
    
  } catch (error) {
    console.error('Unexpected error in getRecipeById:', error);
    return null;
  }
}

/**
 * Search recipes by name
 * 
 * @param query - Search query string
 * @returns Array of matching Recipe objects
 */
export async function searchRecipes(query: string): Promise<Recipe[]> {
  try {
    const { data, error } = await supabase
      .from('recipes')
      .select('id, name, imageUrl, totalTime, ingredientCount')
      .ilike('name', `%${query}%`)
      .limit(20);

    if (error) {
      console.error('Error searching recipes:', error);
      return [];
    }

    return (data as Recipe[]) || [];
    
  } catch (error) {
    console.error('Unexpected error in searchRecipes:', error);
    return [];
  }
}
```

**Key Features**:
- ✅ **Supabase JavaScript client** usage demonstrated
- ✅ **TypeScript strict typing** with Recipe interface
- ✅ **Server Component compatible** (async functions)
- ✅ **Error handling** with graceful degradation
- ✅ **Select specific fields** (id, name, imageUrl, totalTime, ingredientCount)
- ✅ **Multiple query strategies** (viewCount, rating, isPopular flag)
- ✅ **Proper type assertions** for type safety

### 3.3 Data Fetching Best Practices

**Next.js App Router Conventions**:
1. **Server Components by default**: All components are Server Components unless marked with `'use client'`
2. **Direct async/await**: Server Components can be async and directly await data
3. **No useEffect needed**: Data fetching happens during render on server
4. **Automatic caching**: Next.js caches fetch requests by default
5. **Error boundaries**: Use error.tsx for error handling

**Supabase Integration Pattern**:
```typescript
// In Server Component (default in App Router)
async function MyServerComponent() {
  // Direct data fetching - no hooks needed
  const recipes = await getPopularRecipes(6);
  
  return (
    <div>
      {recipes.map(recipe => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}
```

---

## 4. Phase 3: Core Components (Server Components)

### 4.1 Navigation Component

**File**: `src/components/Navigation.tsx`

```typescript
import Link from 'next/link';
import { NavigationLink } from '@/lib/types';

const navigationLinks: NavigationLink[] = [
  { label: 'Recipes', href: '/recipes' },
  { label: 'About', href: '/about' },
];

export default function Navigation() {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Title */}
          <Link href="/" className="text-2xl font-bold text-gray-900">
            Generational Spoons
          </Link>
          
          {/* Navigation Links */}
          <div className="flex gap-6">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
```

**Component Type**: Server Component (default)
**Dependencies**: Next.js Link
**Props**: None (static navigation)

### 4.2 Hero Section Component

**File**: `src/components/HeroSection.tsx`

```typescript
import Image from 'next/image';
import SearchBar from './SearchBar';
import { HeroSectionProps } from '@/lib/types';

export default function HeroSection({ heroImage, welcomeMessage }: HeroSectionProps) {
  return (
    <section className="relative h-[60vh] md:h-[70vh] lg:h-[80vh]">
      {/* Hero Image */}
      <Image
        src={heroImage.src}
        alt={heroImage.alt}
        fill
        priority // Don't lazy load hero image
        className="object-cover"
        sizes="100vw"
      />
      
      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl">
          {/* Welcome Message */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            {welcomeMessage.heading}
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8">
            {welcomeMessage.subheading}
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <SearchBar placeholder="Search recipes..." />
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Component Type**: Server Component
**Dependencies**: Next.js Image, SearchBar (Client Component)
**Props**: HeroSectionProps (typed)

### 4.3 Popular Recipes Section Component

**File**: `src/components/PopularRecipesSection.tsx`

```typescript
import RecipeCard from './RecipeCard';
import { getPopularRecipes } from '@/lib/data/recipes';

interface PopularRecipesSectionProps {
  limit?: number;
}

export default async function PopularRecipesSection({ 
  limit = 6 
}: PopularRecipesSectionProps) {
  // Server Component - direct async data fetching
  const recipes = await getPopularRecipes(limit);

  // Handle empty state
  if (recipes.length === 0) {
    return (
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Popular Recipes</h2>
          <p className="text-gray-600">No popular recipes available at this time.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Popular Recipes</h2>
        
        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Component Type**: **Server Component (async)**
**Key Features**:
- ✅ Async function - can await data
- ✅ Direct Supabase data fetching via getPopularRecipes()
- ✅ No client-side hooks needed
- ✅ Automatic server-side rendering
- ✅ Type-safe with PopularRecipesSectionProps

### 4.4 Recipe Card Component

**File**: `src/components/RecipeCard.tsx`

```typescript
import Image from 'next/image';
import Link from 'next/link';
import { RecipeCardProps } from '@/lib/types';

export default function RecipeCard({ recipe }: RecipeCardProps) {
  // Format time display
  const formatTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours} hr ${mins} min` : `${hours} hr`;
  };

  return (
    <Link href={`/recipes/${recipe.id}`}>
      <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer">
        {/* Recipe Image */}
        <div className="relative aspect-video">
          <Image
            src={recipe.imageUrl}
            alt={recipe.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
        
        {/* Recipe Info */}
        <div className="p-4">
          {/* Recipe Name */}
          <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
            {recipe.name}
          </h3>
          
          {/* Metadata */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            {/* Total Time */}
            <div className="flex items-center gap-1">
              <span aria-label="Time">🕐</span>
              <span>{formatTime(recipe.totalTime)}</span>
            </div>
            
            {/* Ingredient Count */}
            <div className="flex items-center gap-1">
              <span aria-label="Ingredients">🧾</span>
              <span>{recipe.ingredientCount} ingredients</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
```

**Component Type**: Server Component
**Dependencies**: Next.js Image, Next.js Link
**Props**: RecipeCardProps (typed)

### 4.5 Footer Component

**File**: `src/components/Footer.tsx`

```typescript
import { FooterProps } from '@/lib/types';

const defaultSocialLinks = [
  {
    platform: 'linkedin' as const,
    url: 'https://www.linkedin.com/in/kayla-gillam-wright',
    ariaLabel: 'LinkedIn profile',
  },
  {
    platform: 'portfolio' as const,
    url: 'https://kd.gillamwright.com',
    ariaLabel: 'Portfolio website',
  },
];

export default function Footer({ 
  copyrightYear = 2025,
  socialLinks = defaultSocialLinks 
}: FooterProps = { copyrightYear: 2025, socialLinks: defaultSocialLinks }) {
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4">
          {/* Copyright Notice */}
          <p className="text-sm text-gray-600 text-center sm:text-left">
            Created by Kayla Gillam-Wright © {copyrightYear}
          </p>
          
          {/* Social Media Links */}
          <div className="flex gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.ariaLabel}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {link.platform === 'linkedin' ? (
                  <LinkedInIcon />
                ) : (
                  <PortfolioIcon />
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// Simple SVG Icons
function LinkedInIcon() {
  return (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function PortfolioIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  );
}
```

**Component Type**: Server Component
**Props**: FooterProps (typed, with defaults)

---

## 5. Phase 4: Interactive Components (Client Components)

### 5.1 Search Bar Component

**File**: `src/components/SearchBar.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  placeholder?: string;
}

export default function SearchBar({ placeholder = 'Search recipes...' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/recipes?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full px-6 py-4 text-lg rounded-full border-2 border-transparent focus:border-blue-500 focus:outline-none shadow-lg"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full transition-colors"
          aria-label="Search"
        >
          <SearchIcon />
        </button>
      </div>
    </form>
  );
}

function SearchIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}
```

**Component Type**: **Client Component** (`'use client'`)
**Why Client Component**: Uses useState and form handling
**Props**: SearchBarProps (typed)

---

## 6. Phase 5: Homepage Assembly

### 6.1 Homepage Component

**File**: `src/app/page.tsx`

```typescript
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import PopularRecipesSection from '@/components/PopularRecipesSection';
import Footer from '@/components/Footer';

export default function HomePage() {
  // Hero section data (could be moved to config or CMS)
  const heroData = {
    heroImage: {
      src: '/images/hero-image.jpg',
      alt: 'Family cooking together in a warm kitchen',
    },
    welcomeMessage: {
      heading: 'Welcome to Generational Spoons',
      subheading: 'Preserving family recipes, one dish at a time',
    },
  };

  return (
    <>
      <Navigation />
      <main>
        <HeroSection {...heroData} />
        <PopularRecipesSection limit={6} />
      </main>
      <Footer />
    </>
  );
}
```

**Component Type**: Server Component (default)
**Key Features**:
- ✅ Simple, clean composition
- ✅ Server Component by default
- ✅ PopularRecipesSection fetches data internally (async)
- ✅ No client-side data fetching needed

### 6.2 Root Layout

**File**: `src/app/layout.tsx` (update if needed)

```typescript
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Generational Spoons',
  description: 'Preserving family recipes, one dish at a time',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
```

---

## 7. Phase 6: Styling & Optimization

### 7.1 Global Styles

**File**: `src/app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom utilities if needed */
@layer utilities {
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
```

### 7.2 Image Optimization Checklist

- ✅ Use Next.js Image component for all images
- ✅ Set priority={true} for hero image
- ✅ Configure appropriate sizes prop for responsive images
- ✅ Use aspect ratio containers for layout stability
- ✅ Provide proper alt text for accessibility

### 7.3 Performance Optimizations

- ✅ Server Components by default (zero JS for static content)
- ✅ Supabase queries run server-side (no client exposure)
- ✅ Automatic code splitting with App Router
- ✅ Image optimization with Next.js Image
- ✅ Minimal client-side JavaScript (only SearchBar)

---

## 8. Implementation Order

### 8.1 Step-by-Step Execution

1. **Create Type Definitions** (`src/lib/types.ts`)
   - Define all TypeScript interfaces
   - Export for use across app

2. **Set Up Supabase Data Layer** (`src/lib/supabase/server.ts`, `src/lib/data/recipes.ts`)
   - Create server-side Supabase client
   - Implement `getPopularRecipes()` function
   - Test data fetching

3. **Build Server Components**
   - Navigation
   - Footer
   - RecipeCard
   - HeroSection (without SearchBar)

4. **Build Client Component**
   - SearchBar

5. **Build Data-Fetching Component**
   - PopularRecipesSection (async Server Component)

6. **Assemble Homepage**
   - Update `src/app/page.tsx`
   - Import and compose all components

7. **Add Styling**
   - Tailwind CSS classes
   - Responsive breakpoints
   - Hover states

8. **Test & Verify**
   - Manual testing on all breakpoints
   - Verify Supabase data fetching
   - Check type safety

---

## 9. Supabase Database Requirements

### 9.1 Required Table Schema

**Table Name**: `recipes`

**Required Columns**:
```sql
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  imageUrl TEXT NOT NULL,
  totalTime INTEGER NOT NULL, -- in minutes
  ingredientCount INTEGER NOT NULL,
  
  -- JSONB columns for structured recipe data (required for recipe detail pages)
  directions JSONB NOT NULL, -- Array of direction objects: [{step: 1, instruction: "Preheat oven..."}]
  full_ingredients JSONB NOT NULL, -- Array of ingredient objects: [{name: "flour", amount: 2, unit: "cups", notes: "sifted"}]
  
  -- Optional columns for popularity tracking
  viewCount INTEGER DEFAULT 0,
  rating NUMERIC(3, 2),
  isPopular BOOLEAN DEFAULT false,
  description TEXT, -- Short description for recipe cards
  
  -- Timestamps
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_recipes_viewCount ON recipes(viewCount DESC);
CREATE INDEX idx_recipes_rating ON recipes(rating DESC);
CREATE INDEX idx_recipes_isPopular ON recipes(isPopular) WHERE isPopular = true;

-- GIN indexes for JSONB columns (enables efficient queries on JSONB data)
CREATE INDEX idx_recipes_directions ON recipes USING GIN (directions);
CREATE INDEX idx_recipes_full_ingredients ON recipes USING GIN (full_ingredients);
```

**JSONB Structure Examples**:

```typescript
// directions structure
[
  { "step": 1, "instruction": "Preheat oven to 350°F (175°C)" },
  { "step": 2, "instruction": "Mix flour, sugar, and salt in a large bowl" },
  { "step": 3, "instruction": "Add eggs and vanilla extract, mix until combined" }
]

// full_ingredients structure
[
  { "name": "all-purpose flour", "amount": 2, "unit": "cups", "notes": "sifted" },
  { "name": "granulated sugar", "amount": 1, "unit": "cup", "notes": "" },
  { "name": "salt", "amount": 0.5, "unit": "teaspoon", "notes": "" },
  { "name": "eggs", "amount": 2, "unit": "large", "notes": "room temperature" }
]
```

### 9.2 Sample Data for Testing

```sql
INSERT INTO recipes (name, imageUrl, totalTime, ingredientCount, viewCount, rating, isPopular, description, directions, full_ingredients)
VALUES
  (
    'Grandma''s Apple Pie',
    '/images/apple-pie.jpg',
    120,
    8,
    150,
    4.9,
    true,
    'A classic apple pie recipe passed down through generations',
    '[
      {"step": 1, "instruction": "Preheat oven to 425°F (220°C)"},
      {"step": 2, "instruction": "Mix sliced apples with sugar, cinnamon, and flour"},
      {"step": 3, "instruction": "Place bottom crust in pie pan, add apple mixture"},
      {"step": 4, "instruction": "Cover with top crust, seal edges, and cut vents"},
      {"step": 5, "instruction": "Bake for 45-50 minutes until golden brown"}
    ]'::jsonb,
    '[
      {"name": "apples", "amount": 6, "unit": "medium", "notes": "peeled and sliced"},
      {"name": "granulated sugar", "amount": 0.75, "unit": "cup", "notes": ""},
      {"name": "ground cinnamon", "amount": 1, "unit": "teaspoon", "notes": ""},
      {"name": "all-purpose flour", "amount": 2, "unit": "tablespoons", "notes": ""},
      {"name": "pie crust", "amount": 2, "unit": "9-inch", "notes": "homemade or store-bought"}
    ]'::jsonb
  ),
  (
    'Classic Chocolate Chip Cookies',
    '/images/cookies.jpg',
    45,
    12,
    200,
    4.8,
    true,
    'Soft and chewy chocolate chip cookies that melt in your mouth',
    '[
      {"step": 1, "instruction": "Preheat oven to 375°F (190°C)"},
      {"step": 2, "instruction": "Cream together butter and sugars until fluffy"},
      {"step": 3, "instruction": "Beat in eggs and vanilla extract"},
      {"step": 4, "instruction": "Mix in flour, baking soda, and salt"},
      {"step": 5, "instruction": "Fold in chocolate chips"},
      {"step": 6, "instruction": "Drop rounded tablespoons onto baking sheet"},
      {"step": 7, "instruction": "Bake for 9-11 minutes until golden"}
    ]'::jsonb,
    '[
      {"name": "butter", "amount": 1, "unit": "cup", "notes": "softened"},
      {"name": "granulated sugar", "amount": 0.75, "unit": "cup", "notes": ""},
      {"name": "brown sugar", "amount": 0.75, "unit": "cup", "notes": "packed"},
      {"name": "eggs", "amount": 2, "unit": "large", "notes": ""},
      {"name": "vanilla extract", "amount": 2, "unit": "teaspoons", "notes": ""},
      {"name": "all-purpose flour", "amount": 2.25, "unit": "cups", "notes": ""},
      {"name": "baking soda", "amount": 1, "unit": "teaspoon", "notes": ""},
      {"name": "salt", "amount": 1, "unit": "teaspoon", "notes": ""},
      {"name": "chocolate chips", "amount": 2, "unit": "cups", "notes": "semi-sweet"}
    ]'::jsonb
  ),
  (
    'Sunday Pot Roast',
    '/images/pot-roast.jpg',
    240,
    15,
    100,
    4.7,
    true,
    'Tender pot roast with vegetables, perfect for Sunday dinner',
    '[
      {"step": 1, "instruction": "Preheat oven to 325°F (165°C)"},
      {"step": 2, "instruction": "Season roast with salt and pepper, sear all sides in Dutch oven"},
      {"step": 3, "instruction": "Remove roast, sauté onions and garlic"},
      {"step": 4, "instruction": "Return roast to pot, add broth, wine, and herbs"},
      {"step": 5, "instruction": "Cover and roast for 3 hours, add vegetables last hour"}
    ]'::jsonb,
    '[
      {"name": "chuck roast", "amount": 3, "unit": "pounds", "notes": ""},
      {"name": "onions", "amount": 2, "unit": "large", "notes": "quartered"},
      {"name": "carrots", "amount": 6, "unit": "medium", "notes": "cut into chunks"},
      {"name": "potatoes", "amount": 4, "unit": "large", "notes": "quartered"},
      {"name": "beef broth", "amount": 2, "unit": "cups", "notes": ""},
      {"name": "red wine", "amount": 1, "unit": "cup", "notes": ""},
      {"name": "garlic", "amount": 4, "unit": "cloves", "notes": "minced"}
    ]'::jsonb
  );
```

---

## 10. Environment Variables

### 10.1 Required Variables

**File**: `.env.local` (create if doesn't exist)

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 10.2 Obtaining Credentials

1. Go to Supabase Dashboard
2. Select your project
3. Go to Settings → API
4. Copy Project URL and anon/public key
5. Add to `.env.local`

---

## 11. Testing Checklist

### 11.1 Functional Testing

- [ ] Navigation links work correctly
- [ ] Search bar accepts input and navigates to results
- [ ] Popular recipes display from Supabase
- [ ] Recipe cards are clickable
- [ ] Footer social links open in new tab
- [ ] All images load properly

### 11.2 Responsive Testing

- [ ] Mobile (< 768px): 1 column grid, stacked footer
- [ ] Tablet (768-1024px): 2 column grid
- [ ] Desktop (> 1024px): 3 column grid
- [ ] Navigation remains sticky on scroll
- [ ] Hero section scales properly

### 11.3 Type Safety Testing

- [ ] No TypeScript errors in build
- [ ] All props properly typed
- [ ] Supabase responses properly typed
- [ ] No `any` types used

### 11.4 Performance Testing

- [ ] Lighthouse score > 90
- [ ] Images optimized with Next.js Image
- [ ] Server Components used where possible
- [ ] No unnecessary client-side JavaScript

---

## 12. Key Differences from Traditional React

### 12.1 Next.js App Router vs. Pages Router

| Feature | App Router (NEW) | Pages Router (OLD) |
|---------|------------------|-------------------|
| Default Component | Server Component | Client Component |
| Data Fetching | async/await in component | getServerSideProps |
| Client Components | Marked with 'use client' | All components |
| Layout System | layout.tsx | _app.tsx |
| Loading States | loading.tsx | Manual implementation |

### 12.2 Server vs. Client Components

**Server Components** (Default):
- Run on server only
- Can directly access database
- Zero JavaScript sent to client
- Can be async functions
- **Example**: PopularRecipesSection

**Client Components** (`'use client'`):
- Run on both server (initial) and client
- Can use hooks (useState, useEffect)
- Handle interactivity
- **Example**: SearchBar

### 12.3 Data Fetching Pattern

**Traditional React** (useEffect + useState):
```typescript
// OLD WAY - Don't do this in App Router
function PopularRecipes() {
  const [recipes, setRecipes] = useState([]);
  
  useEffect(() => {
    fetchRecipes().then(setRecipes);
  }, []);
  
  return <div>{recipes.map(...)}</div>;
}
```

**Next.js App Router** (Server Component):
```typescript
// NEW WAY - Do this
async function PopularRecipes() {
  const recipes = await getPopularRecipes();
  return <div>{recipes.map(...)}</div>;
}
```

---

## 13. Troubleshooting

### 13.1 Common Issues

**Issue**: "You're importing a component that needs useState..."
- **Solution**: Add `'use client'` directive at top of file

**Issue**: Supabase environment variables not found
- **Solution**: Restart dev server after adding .env.local

**Issue**: Images not loading
- **Solution**: Check image paths, ensure images exist in public/images/

**Issue**: Type errors with Supabase response
- **Solution**: Use proper type assertions: `data as Recipe[]`

### 13.2 Debugging Data Fetching

```typescript
// Add logging to recipes.ts
export async function getPopularRecipes(limit: number = 6): Promise<Recipe[]> {
  console.log('Fetching popular recipes...');
  
  const { data, error } = await supabase
    .from('recipes')
    .select('id, name, imageUrl, totalTime, ingredientCount')
    .order('viewCount', { ascending: false })
    .limit(limit);
  
  console.log('Supabase response:', { data, error });
  
  if (error) {
    console.error('Error:', error);
    return [];
  }
  
  return data as Recipe[];
}
```

---

## 14. Next Steps After Homepage

1. Create `/recipes` page (recipe listing)
2. Create `/recipes/[id]` page (recipe detail)
3. Create `/about` page
4. Implement full search functionality
5. Add authentication (if needed)

---

## 15. Summary: Key Implementation Points

### ✅ Supabase JavaScript Client Usage (PRIORITY)

1. **Server-side client** in `src/lib/supabase/server.ts`
2. **Data fetching functions** in `src/lib/data/recipes.ts`
3. **Typed queries** using TypeScript interfaces
4. **Error handling** with try/catch and graceful degradation
5. **Direct async/await** in Server Components

### ✅ Next.js App Router Conventions

1. **Server Components by default** - no 'use client' unless needed
2. **Async Server Components** for data fetching
3. **Client Components** only for interactivity (SearchBar)
4. **File-based routing** in `src/app/` directory
5. **layout.tsx** for shared layouts

### ✅ TypeScript Strict Typing

1. **All interfaces defined** in `src/lib/types.ts`
2. **Props properly typed** for all components
3. **Supabase responses typed** with type assertions
4. **No implicit any** - strict mode enabled

---

**Implementation Status**: Ready to begin  
**Estimated Time**: 4-6 hours  
**Priority**: Phase 2 (Data Fetching Layer) is critical foundation

