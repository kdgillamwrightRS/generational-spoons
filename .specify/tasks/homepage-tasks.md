---
description: "Task list for Homepage Implementation"
feature: "Homepage"
plan: "../plans/homepage-implementation-plan.md"
spec: "../specs/homepage-specification.md"
---

# Tasks: Homepage Implementation

**Input**: Design documents from `.specify/specs/` and `.specify/plans/`
**Prerequisites**: homepage-implementation-plan.md, homepage-specification.md, constitution.md
**Status**: 19/26 tasks complete (73%)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which feature area this task belongs to

---

## Phase 1: Setup & Foundation ✅ COMPLETE

**Purpose**: Project initialization and basic structure

- [x] T001 Create project structure per implementation plan
- [x] T002 Initialize Next.js 16 project with TypeScript and Tailwind CSS
- [x] T003 Install Supabase JavaScript client dependencies

---

## Phase 2: TypeScript Types & Supabase Setup ✅ COMPLETE

**Purpose**: Core type definitions and database client configuration

- [x] T004 [P] Create centralized TypeScript types in `src/lib/types.ts`
- [x] T005 [P] Create server-side Supabase client in `src/lib/supabase/server.ts`
- [x] T006 [P] Move existing client to `src/lib/supabase/client.ts`
- [x] T007 Configure environment variables in `.env.local`

**Checkpoint**: Foundation ready - data fetching can now be implemented

---

## Phase 3: Database Schema & Configuration ✅ COMPLETE

**Purpose**: Database structure for recipes and site configuration

- [x] T008 Create `site_config` table schema in `supabase/schema/site_config.sql`
- [x] T009 Add RLS policies for site_config table
- [x] T010 Create seed data for hero, navigation, footer configuration
- [x] T011 Update implementation plan Section 9.1 with JSONB columns for recipes
- [x] T012 Update TypeScript types to include RecipeDetail, RecipeDirection, RecipeIngredient

**Checkpoint**: Database schema documented and types updated

---

## Phase 4: Data Fetching Layer ✅ COMPLETE

**Purpose**: Server-side data fetching functions with type safety

- [x] T013 [P] Create recipe data fetching functions in `src/lib/data/recipes.ts`
- [x] T014 [P] Create config data fetching functions in `src/lib/data/config.ts`
- [x] T015 Implement graceful fallbacks for all config functions
- [x] T016 Add error handling and logging to data layer

**Checkpoint**: Data layer complete - components can now fetch data

---

## Phase 5: Core Components (Server Components) ✅ COMPLETE

**Purpose**: Server-rendered components with database-driven content

- [x] T017 [P] Build Navigation component in `src/components/Navigation.tsx`
- [x] T018 [P] Build Footer component in `src/components/Footer.tsx`
- [x] T019 [P] Build RecipeCard component in `src/components/RecipeCard.tsx`
- [x] T020 [P] Build HeroSection component in `src/components/HeroSection.tsx`
- [x] T021 Build PopularRecipesSection component in `src/components/PopularRecipesSection.tsx`

**Checkpoint**: All server components built

---

## Phase 6: Interactive Components (Client Components) ✅ COMPLETE

**Purpose**: Client-side interactive features

- [x] T022 Build SearchBar client component in `src/components/SearchBar.tsx`
- [x] T023 Integrate SearchBar with HeroSection

**Checkpoint**: All components complete

---

## Phase 7: Homepage Assembly ✅ COMPLETE

**Purpose**: Compose homepage from components with database-driven configuration

- [x] T024 Update `src/app/page.tsx` to fetch hero config from database
- [x] T025 Compose Navigation, HeroSection, PopularRecipesSection, Footer
- [x] T026 Update `src/app/layout.tsx` metadata from database config
- [x] T027 Update `src/app/globals.css` with custom Tailwind utilities

**Checkpoint**: Homepage fully assembled

---

## Phase 8: Database Setup & Deployment 🚧 IN PROGRESS

**Purpose**: Set up real Supabase instance and deploy schema

- [ ] T028 Create Supabase project (or use existing)
- [ ] T029 Run `site_config.sql` schema in Supabase SQL Editor
- [ ] T030 Create `recipes` table schema in Supabase
- [ ] T031 Add JSONB columns (directions, full_ingredients) to recipes table
- [ ] T032 Create GIN indexes for JSONB columns
- [ ] T033 Add RLS policies for recipes table
- [ ] T034 Upload sample recipe data with full directions and ingredients
- [ ] T035 Update `.env.local` with real Supabase credentials
- [ ] T036 Verify database connection with `npm run dev`

**Checkpoint**: Database fully configured and accessible

---

## Phase 9: Recipe Detail Page Implementation 🔜 PENDING

**Purpose**: Full recipe detail view with directions and ingredients

- [ ] T037 Create recipe detail page at `src/app/recipes/[id]/page.tsx`
- [ ] T038 Create RecipeDetail component with directions list
- [ ] T039 Create IngredientsTable component for full_ingredients JSONB
- [ ] T040 Add getRecipeDetail() function to `src/lib/data/recipes.ts`
- [ ] T041 Implement dynamic metadata for recipe pages (SEO)
- [ ] T042 Add print-friendly styles for recipe detail page
- [ ] T043 Add "Back to Recipes" navigation

**Checkpoint**: Recipe detail pages fully functional

---

## Phase 10: Image Assets 🔜 PENDING

**Purpose**: Add real images for hero and recipes

- [ ] T044 Add hero image to `public/images/hero-image.jpg`
- [ ] T045 [P] Add recipe images for Grandma's Apple Pie
- [ ] T046 [P] Add recipe images for Chocolate Chip Cookies
- [ ] T047 [P] Add recipe images for Sunday Pot Roast
- [ ] T048 Update database image URLs to match public paths
- [ ] T049 Verify Next.js Image optimization working

**Checkpoint**: All images loaded and optimized

---

## Phase 11: Testing & Quality Assurance 🔜 PENDING

**Purpose**: Comprehensive testing and validation

### Functionality Testing
- [ ] T050 Test navigation links work correctly
- [ ] T051 Test search bar redirects to `/search?q=query`
- [ ] T052 Test recipe cards link to detail pages
- [ ] T053 Test popular recipes fetch from database
- [ ] T054 Test recipe detail page displays directions correctly
- [ ] T055 Test recipe detail page displays ingredients table correctly
- [ ] T056 Test footer social links open in new tabs
- [ ] T057 Test graceful fallbacks when database unavailable

### Responsive Design Testing
- [ ] T058 Test mobile layout (320px - 1 column recipe grid)
- [ ] T059 Test tablet layout (768px - 2 column recipe grid)
- [ ] T060 Test desktop layout (1024px+ - 3 column recipe grid)
- [ ] T061 Test sticky navigation on scroll
- [ ] T062 Test hero image responsiveness
- [ ] T063 Test recipe card image aspect ratios

### Performance Testing
- [ ] T064 Run Lighthouse audit (target: 90+ performance)
- [ ] T065 Verify image lazy loading working
- [ ] T066 Test Time to First Byte (TTFB)
- [ ] T067 Verify no console errors or warnings

**Checkpoint**: All tests passing

---

## Phase 12: Documentation & Polish 🔜 PENDING

**Purpose**: Complete documentation and final refinements

- [ ] T068 Update README.md with setup instructions
- [ ] T069 Document environment variable requirements
- [ ] T070 Create database setup guide
- [ ] T071 Add inline code comments where needed
- [ ] T072 Verify TypeScript strict mode compliance
- [ ] T073 Run final build verification: `npm run build`
- [ ] T074 Create deployment guide for Vercel

**Checkpoint**: Project fully documented and ready for deployment

---

## Dependencies & Execution Order

### Phase Dependencies

1. **Setup (Phase 1)**: No dependencies - can start immediately ✅
2. **Types & Supabase (Phase 2)**: Depends on Setup ✅
3. **Database Schema (Phase 3)**: Depends on Types ✅
4. **Data Fetching (Phase 4)**: Depends on Database Schema ✅
5. **Components (Phases 5-6)**: Depends on Data Fetching ✅
6. **Homepage Assembly (Phase 7)**: Depends on Components ✅
7. **Database Setup (Phase 8)**: Can start now - CRITICAL for testing 🚧
8. **Recipe Detail (Phase 9)**: Depends on Database Setup 🔜
9. **Images (Phase 10)**: Can run in parallel with Phase 9 🔜
10. **Testing (Phase 11)**: Depends on Phases 8, 9, 10 🔜
11. **Documentation (Phase 12)**: Final phase 🔜

### Parallel Opportunities

**Current Phase (Phase 8)**: All database setup tasks can run sequentially but should be completed before Phase 9

**Phase 9 + 10**: Recipe detail page and image assets can be developed in parallel

**Phase 11**: All testing tasks within each category can run in parallel

---

## Implementation Strategy

### Current Priority: Database Setup (Phase 8)

**Next Steps**:
1. Create/access Supabase project
2. Run SQL schemas in order:
   - `site_config.sql` (already created)
   - Create new `recipes.sql` based on updated plan Section 9.1
3. Add real credentials to `.env.local`
4. Test connection with dev server

### After Database Setup

1. **Immediate**: Build recipe detail page (Phase 9)
2. **Parallel**: Add real images (Phase 10)
3. **Then**: Comprehensive testing (Phase 11)
4. **Finally**: Documentation polish (Phase 12)

---

## Progress Summary

- **Completed**: 27/74 tasks (36%)
- **In Progress**: Phase 8 (Database Setup)
- **Remaining**: Recipe detail pages, images, testing, documentation
- **Build Status**: ✅ Passing with fallbacks
- **Ready for**: Real database connection and testing

---

## Notes

- All TypeScript types are strict-mode compliant
- All components use Server Components by default
- Database-driven configuration with graceful fallbacks implemented
- JSONB columns designed for flexible recipe data storage
- Ready for Supabase project setup and real data testing
