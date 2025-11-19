# Generational Spoons Homepage Specification

**Version**: 1.0  
**Created**: November 18, 2025  
**Status**: Draft  
**Adherence**: Simple UX, Responsive Design, Clean Code

---

## 1. Overview

### 1.1 Purpose
The Generational Spoons Homepage serves as the primary entry point for users to discover and access family recipes. It provides a welcoming, intuitive interface that enables quick recipe search and showcases popular family recipes.

### 1.2 Design Philosophy
- **Simple UX**: Minimal cognitive load with clear visual hierarchy and intuitive navigation
- **Responsive Design**: Mobile-first approach ensuring seamless experience across all devices
- **Clean Code**: Component-based architecture with TypeScript strict typing

### 1.3 Success Criteria
- Users can navigate to key sections within 1-2 clicks
- Homepage loads and displays properly on mobile, tablet, and desktop
- Recipe search is immediately accessible
- Popular recipes are discoverable without scrolling (on desktop)

---

## 2. Component Architecture

### 2.1 Component Hierarchy
```
HomePage
├── Navigation
├── HeroSection
│   ├── WelcomeMessage
│   ├── HeroImage
│   └── SearchBar
├── PopularRecipesSection
│   └── RecipeCard[]
└── Footer
    ├── CopyrightNotice
    └── SocialMediaLinks
```

### 2.2 Technology Stack
- **Framework**: Next.js (App Router)
- **Language**: TypeScript with strict type checking
- **Styling**: Tailwind CSS
- **Data Source**: Supabase (for recipe data)
- **Image Handling**: Next.js Image component for optimization

---

## 3. Detailed Component Specifications

### 3.1 Navigation Component

#### 3.1.1 Purpose
Provide simplified, persistent navigation to core sections of the application.

#### 3.1.2 Requirements
- **MUST** display the application logo/title "Generational Spoons"
- **MUST** include exactly two navigation links:
  - "Recipes" - links to recipe listing page
  - "About" - links to about page
- **MUST** be sticky/fixed at the top of the viewport
- **MUST** maintain visibility across all page scroll positions
- **MUST** use clear visual contrast for accessibility

#### 3.1.3 Responsive Behavior
- **Mobile** (< 768px):
  - Logo/title aligned left
  - Navigation links aligned right
  - Horizontal layout maintained (no hamburger menu needed for 2 links)
  - Adequate touch targets (minimum 44px × 44px)
  
- **Tablet** (768px - 1024px):
  - Logo/title aligned left
  - Navigation links aligned right with increased spacing
  
- **Desktop** (> 1024px):
  - Centered content container with max-width
  - Logo/title aligned left within container
  - Navigation links aligned right within container

#### 3.1.4 Design Specifications
- **Background**: Solid color with subtle shadow for depth
- **Typography**: 
  - Logo: Large, bold font (brand identity)
  - Links: Medium weight, easily readable
- **Spacing**: Consistent padding (1rem mobile, 1.5rem desktop)
- **States**: Hover effects on navigation links

#### 3.1.5 Type Definition
```typescript
interface NavigationProps {
  // No props needed - static navigation
}

interface NavigationLink {
  label: string;
  href: string;
}
```

---

### 3.2 Hero Section

#### 3.2.1 Purpose
Create an inviting entry point that welcomes users and provides immediate access to recipe search functionality.

#### 3.2.2 Requirements
- **MUST** include a high-quality hero image representing family cooking/recipes
- **MUST** display a welcoming message that conveys warmth and family tradition
- **MUST** include a prominently placed search bar
- **MUST** be visually compelling and establish brand identity
- **MUST** be the first content section below navigation

#### 3.2.3 Layout Structure
```
┌─────────────────────────────────────┐
│                                     │
│  [Hero Image - Full Width]         │
│                                     │
│  ┌───────────────────────────────┐ │
│  │  Welcome Message              │ │
│  │  (Overlaid on image)          │ │
│  │                               │ │
│  │  [Search Bar]                 │ │
│  └───────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

#### 3.2.4 Welcome Message
- **Content**: 
  - Primary heading: "Welcome to Generational Spoons"
  - Subheading: "Preserving family recipes, one dish at a time"
- **Typography**:
  - Primary: Large, bold, highly readable
  - Subheading: Medium, lighter weight
- **Color**: High contrast against hero image (white text with dark overlay, or dark text with light overlay)

#### 3.2.5 Hero Image
- **Requirements**:
  - High resolution (minimum 1920px width)
  - Optimized using Next.js Image component
  - Lazy loading disabled (above the fold)
  - Alt text: "Family cooking together in a warm kitchen"
- **Source**: To be provided or sourced from stock photography
- **Overlay**: Semi-transparent gradient to ensure text readability

#### 3.2.6 Search Bar
- **Functionality**:
  - **MUST** accept text input for recipe search
  - **MUST** search across recipe names (minimum)
  - **SHOULD** search across ingredients and tags (future enhancement)
  - **MUST** display search results on a dedicated results page
  - **MUST** include a clear search icon/button
  - **MUST** include placeholder text: "Search recipes..."
  
- **Design**:
  - Wide input field (70-80% of container width on desktop)
  - Rounded corners for modern aesthetic
  - Clear search icon positioned right
  - White/light background with subtle shadow
  - Focus state with border highlight

#### 3.2.7 Responsive Behavior
- **Mobile** (< 768px):
  - Hero image height: 60vh
  - Welcome message: Centered, padding 1rem
  - Search bar: Full width minus 1rem padding on each side
  - Stacked vertically, centered alignment
  
- **Tablet** (768px - 1024px):
  - Hero image height: 70vh
  - Welcome message: Centered, padding 2rem
  - Search bar: 80% width, centered
  
- **Desktop** (> 1024px):
  - Hero image height: 80vh
  - Welcome message: Centered within max-width container
  - Search bar: 600px max-width, centered

#### 3.2.8 Type Definition
```typescript
interface HeroSectionProps {
  heroImage: {
    src: string;
    alt: string;
  };
  welcomeMessage: {
    heading: string;
    subheading: string;
  };
}

interface SearchBarProps {
  placeholder: string;
  onSearch: (query: string) => void;
}
```

---

### 3.3 Popular Recipes Section

#### 3.3.1 Purpose
Showcase a curated selection of popular family recipes to encourage exploration and engagement.

#### 3.3.2 Requirements
- **MUST** display section heading: "Popular Recipes"
- **MUST** show exactly 6-8 popular recipes (configurable)
- **MUST** use responsive card grid layout
- **MUST** fetch recipe data from Supabase
- **MUST** handle loading and error states gracefully
- **MUST** be visually distinct from hero section

#### 3.3.3 Section Layout
- **Heading**: 
  - Text: "Popular Recipes"
  - Typography: Large, bold, section divider
  - Alignment: Left-aligned within container
  - Spacing: Generous top/bottom margin

- **Grid Layout**:
  - Mobile: 1 column
  - Tablet: 2 columns
  - Desktop: 3-4 columns
  - Gap: Consistent spacing between cards (1rem)

#### 3.3.4 Data Source
- **Source**: Supabase `recipes` table
- **Query Logic**:
  - Order by view count (descending) OR
  - Order by rating (descending) OR
  - Manually curated "popular" flag
- **Limit**: 6-8 recipes
- **Fields Required**:
  - Recipe ID
  - Recipe name
  - Recipe image URL
  - Total time (in minutes)
  - Ingredient count

#### 3.3.5 Responsive Behavior
- **Mobile** (< 768px):
  - 1 column grid
  - Full width cards minus padding
  - Vertical scrolling
  
- **Tablet** (768px - 1024px):
  - 2 column grid
  - Equal width cards
  - Consistent gap spacing
  
- **Desktop** (> 1024px):
  - 3-4 column grid (3 recommended for better card size)
  - Max container width
  - Equal width cards

#### 3.3.6 Loading State
- Display skeleton cards while data loads
- Maintain grid layout during loading
- Smooth transition when data populates

#### 3.3.7 Error State
- Display user-friendly error message
- Provide retry mechanism
- Maintain layout structure

#### 3.3.8 Type Definition
```typescript
interface PopularRecipesSectionProps {
  limit?: number; // Default: 6
}

interface Recipe {
  id: string;
  name: string;
  imageUrl: string;
  totalTime: number; // in minutes
  ingredientCount: number;
}
```

---

### 3.4 Recipe Card Component

#### 3.4.1 Purpose
Display individual recipe information in a compact, scannable format that encourages user interaction.

#### 3.4.2 Requirements
- **MUST** display recipe image
- **MUST** display recipe name
- **MUST** display total time
- **MUST** display ingredient count
- **MUST** be clickable/tappable to navigate to recipe detail page
- **MUST** provide visual feedback on hover/tap
- **MUST NOT** include ratings or other metrics (simple UX)

#### 3.4.3 Card Structure
```
┌─────────────────────────┐
│                         │
│   [Recipe Image]        │
│   (16:9 ratio)          │
│                         │
├─────────────────────────┤
│  Recipe Name            │
│  (truncate if too long) │
├─────────────────────────┤
│  🕐 45 min              │
│  🧾 12 ingredients      │
└─────────────────────────┘
```

#### 3.4.4 Image Specifications
- **Aspect Ratio**: 16:9 or 4:3 (consistent across all cards)
- **Optimization**: Next.js Image component with:
  - Lazy loading enabled
  - Responsive sizes
  - WebP format support
- **Fallback**: Default placeholder image if recipe image missing
- **Alt Text**: Recipe name

#### 3.4.5 Recipe Name
- **Typography**: Medium-large, semi-bold
- **Truncation**: Max 2 lines with ellipsis
- **Alignment**: Left-aligned
- **Spacing**: Padding top/bottom

#### 3.4.6 Metadata Display
- **Total Time**:
  - Icon: Clock emoji or SVG icon
  - Format: "X min" or "X hr Y min" (if > 60 min)
  - Typography: Small, regular weight
  
- **Ingredient Count**:
  - Icon: List emoji or SVG icon
  - Format: "X ingredients"
  - Typography: Small, regular weight

- **Layout**: Horizontal inline display with icons

#### 3.4.7 Interactive States
- **Default**: Clean, bordered card with subtle shadow
- **Hover** (desktop): 
  - Slight scale transform (1.02)
  - Increased shadow
  - Cursor: pointer
- **Active/Tap** (mobile):
  - Slight opacity reduction
  - Maintain tap target size
  
#### 3.4.8 Accessibility
- **MUST** include proper semantic HTML (article tag)
- **MUST** include ARIA labels for icons
- **MUST** maintain adequate color contrast
- **MUST** support keyboard navigation

#### 3.4.9 Card Dimensions
- **Mobile**: Full width minus padding
- **Tablet**: ~48% container width (2 columns)
- **Desktop**: ~31% container width (3 columns) or ~23% (4 columns)
- **Height**: Auto, based on content (consistent image ratio maintains uniformity)

#### 3.4.10 Type Definition
```typescript
interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
}

interface Recipe {
  id: string;
  name: string;
  imageUrl: string;
  totalTime: number; // in minutes
  ingredientCount: number;
}
```

---

### 3.5 Footer Component

#### 3.5.1 Purpose
Provide copyright information and professional social media links in a clean, unobtrusive manner.

#### 3.5.2 Requirements
- **MUST** display copyright notice: "Created by Kayla Gillam-Wright © 2025"
- **MUST** include social media icons for:
  - LinkedIn
  - Portfolio website
- **MUST** center copyright notice
- **MUST** align social media icons to the right
- **MUST** be responsive across all devices
- **MUST** maintain visual consistency with overall design

#### 3.5.3 Layout Structure
```
┌─────────────────────────────────────────────────┐
│                                                 │
│  Created by Kayla Gillam-Wright © 2025  [Li][P]│
│                                                 │
└─────────────────────────────────────────────────┘
```

#### 3.5.4 Copyright Notice
- **Text**: "Created by Kayla Gillam-Wright © 2025"
- **Typography**: Small, regular weight
- **Alignment**: Centered horizontally
- **Color**: Muted color for subtle appearance

#### 3.5.5 Social Media Icons
- **Icons Required**:
  - LinkedIn icon (link to LinkedIn profile)
  - Portfolio icon (link to portfolio website)
  
- **Design**:
  - Icon size: 24px × 24px (1.5rem)
  - Color: Muted, matching footer text
  - Hover state: Color change to primary brand color
  - Spacing: 1rem gap between icons
  
- **Links**:
  - **MUST** open in new tab (target="_blank")
  - **MUST** include rel="noopener noreferrer"
  - **MUST** include ARIA labels ("LinkedIn profile", "Portfolio website")

#### 3.5.6 Responsive Behavior
- **Mobile** (< 768px):
  - Stacked layout:
    - Copyright notice: Centered, full width
    - Social media icons: Centered below, 1rem margin-top
  - Vertical alignment maintained
  
- **Tablet & Desktop** (>= 768px):
  - Horizontal layout:
    - Copyright notice: Centered
    - Social media icons: Absolute right OR flex layout with space-between
  - Single row layout

#### 3.5.7 Spacing & Background
- **Background**: Distinct from page content (light gray or subtle color)
- **Padding**: 2rem vertical, 1.5rem horizontal
- **Position**: Bottom of page (not fixed/sticky)
- **Border**: Optional subtle top border for visual separation

#### 3.5.8 Type Definition
```typescript
interface FooterProps {
  copyrightYear?: number; // Default: 2025
  socialLinks: SocialLink[];
}

interface SocialLink {
  platform: 'linkedin' | 'portfolio';
  url: string;
  ariaLabel: string;
}
```

---

## 4. Data Model

### 4.1 Recipe Data Structure (Supabase)

```typescript
interface Recipe {
  id: string; // UUID
  name: string; // Recipe title
  description?: string; // Brief description
  imageUrl: string; // URL to recipe image
  totalTime: number; // Total time in minutes
  ingredientCount: number; // Number of ingredients
  viewCount?: number; // For popularity tracking
  rating?: number; // For popularity tracking
  isPopular?: boolean; // Manual curation flag
  createdAt: Date;
  updatedAt: Date;
}
```

### 4.2 Supabase Query

```typescript
// Fetch popular recipes
const { data: recipes, error } = await supabase
  .from('recipes')
  .select('id, name, imageUrl, totalTime, ingredientCount')
  .order('viewCount', { ascending: false })
  .limit(6);
```

---

## 5. User Interactions

### 5.1 Navigation Interactions
- **Click "Recipes"**: Navigate to `/recipes` page
- **Click "About"**: Navigate to `/about` page
- **Click logo/title**: Navigate to homepage (`/`)

### 5.2 Search Interactions
- **Enter search query**: 
  - User types in search bar
  - On Enter key OR search button click
  - Navigate to `/recipes?search=[query]`
  - Display filtered results

### 5.3 Recipe Card Interactions
- **Click/tap card**: Navigate to `/recipes/[recipeId]` detail page
- **Hover** (desktop): Visual feedback (scale, shadow)

### 5.4 Footer Interactions
- **Click LinkedIn icon**: Open LinkedIn profile in new tab
- **Click Portfolio icon**: Open portfolio website in new tab

---

## 6. Responsive Breakpoints

### 6.1 Tailwind CSS Breakpoints
```
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
2xl: 1536px
```

### 6.2 Implementation Strategy
- **Mobile-first**: Base styles for mobile, media queries for larger screens
- **Testing**: Test on actual devices and browser dev tools
- **Breakpoints Used**:
  - Mobile: < 768px (default)
  - Tablet: 768px - 1024px (md)
  - Desktop: > 1024px (lg)

---

## 7. Performance Considerations

### 7.1 Image Optimization
- **MUST** use Next.js Image component for all images
- **MUST** specify width and height for layout stability
- **MUST** use appropriate sizes prop for responsive images
- **MUST** lazy load images below the fold
- **MUST NOT** lazy load hero image (priority prop)

### 7.2 Data Fetching
- **Server Components**: Fetch recipe data in server component (default in Next.js App Router)
- **Caching**: Leverage Next.js caching for recipe data
- **Error Handling**: Graceful fallbacks for failed data fetches

### 7.3 Bundle Size
- **Minimize dependencies**: Use only essential libraries
- **Tree shaking**: Ensure unused code is eliminated
- **Code splitting**: Automatic with Next.js App Router

---

## 8. Accessibility Requirements

### 8.1 Keyboard Navigation
- **MUST** support tab navigation through all interactive elements
- **MUST** provide visible focus indicators
- **MUST** maintain logical tab order

### 8.2 Screen Readers
- **MUST** use semantic HTML (nav, header, main, footer, article)
- **MUST** provide alt text for all images
- **MUST** include ARIA labels for icon-only buttons/links
- **MUST** use proper heading hierarchy (h1, h2, h3)

### 8.3 Color Contrast
- **MUST** meet WCAG AA standards (minimum 4.5:1 for normal text)
- **MUST** ensure text is readable against background images

---

## 9. Error Handling

### 9.1 Data Fetch Errors
- **Scenario**: Supabase query fails
- **Handling**: 
  - Display user-friendly error message
  - Provide retry button
  - Log error for debugging

### 9.2 Missing Images
- **Scenario**: Recipe image URL is broken/missing
- **Handling**: 
  - Display placeholder image
  - Maintain card layout

### 9.3 Search Errors
- **Scenario**: Search query fails
- **Handling**: 
  - Display error message
  - Keep search bar functional
  - Provide clear feedback

---

## 10. Implementation Checklist

### 10.1 Phase 1: Structure
- [ ] Create component directory structure
- [ ] Define TypeScript interfaces
- [ ] Set up Supabase connection
- [ ] Create base layout with navigation and footer

### 10.2 Phase 2: Hero Section
- [ ] Implement hero image with overlay
- [ ] Create welcome message component
- [ ] Build search bar component
- [ ] Test responsive behavior

### 10.3 Phase 3: Popular Recipes
- [ ] Create RecipeCard component
- [ ] Implement recipe grid layout
- [ ] Fetch data from Supabase
- [ ] Add loading and error states
- [ ] Test responsive grid

### 10.4 Phase 4: Polish
- [ ] Implement hover/interaction states
- [ ] Add smooth transitions
- [ ] Optimize images
- [ ] Test accessibility
- [ ] Cross-browser testing
- [ ] Mobile device testing

---

## 11. Design Tokens (Tailwind CSS)

### 11.1 Colors
```typescript
// To be defined based on brand identity
primary: // Main brand color
secondary: // Accent color
neutral: // Grays for text and backgrounds
```

### 11.2 Typography
```typescript
// Font families (Tailwind default or custom)
fontFamily: {
  sans: [...], // Primary font
}

// Font sizes
fontSize: {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  // etc.
}
```

### 11.3 Spacing
- Use Tailwind's default spacing scale (0.25rem increments)
- Consistent padding/margin throughout

### 11.4 Shadows
- Subtle shadows for cards and navigation
- Elevated shadows for hover states

---

## 12. File Structure

```
src/
├── app/
│   ├── page.tsx                    # Homepage
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Global styles
│   └── recipes/
│       └── page.tsx                # Recipes listing page
├── components/
│   ├── Navigation.tsx              # Navigation component
│   ├── HeroSection.tsx             # Hero section
│   │   ├── WelcomeMessage.tsx      # Welcome message
│   │   └── SearchBar.tsx           # Search bar
│   ├── PopularRecipesSection.tsx   # Popular recipes section
│   ├── RecipeCard.tsx              # Recipe card component
│   └── Footer.tsx                  # Footer component
├── lib/
│   ├── supabase.ts                 # Supabase client
│   └── types.ts                    # TypeScript types
└── public/
    └── images/
        ├── hero-image.jpg          # Hero section image
        └── recipe-placeholder.jpg  # Fallback recipe image
```

---

## 13. Acceptance Criteria

### 13.1 Functional Requirements
- ✅ Navigation displays "Recipes" and "About" links
- ✅ Hero section includes image, welcome message, and search bar
- ✅ Search bar accepts input and navigates to search results
- ✅ Popular Recipes section displays 6-8 recipes
- ✅ Recipe cards show image, name, time, and ingredient count
- ✅ Recipe cards are clickable and navigate to detail page
- ✅ Footer displays copyright notice and social media icons

### 13.2 Non-Functional Requirements
- ✅ Page is fully responsive (mobile, tablet, desktop)
- ✅ All images are optimized with Next.js Image component
- ✅ Color contrast meets WCAG AA standards
- ✅ Keyboard navigation works for all interactive elements
- ✅ Page loads in under 3 seconds on 3G connection
- ✅ No layout shift during page load (CLS < 0.1)

### 13.3 Design Requirements
- ✅ Adheres to Simple UX principles (minimal cognitive load)
- ✅ Consistent spacing and typography throughout
- ✅ Clear visual hierarchy
- ✅ Smooth hover/interaction states
- ✅ Mobile-first responsive design

---

## 14. Future Enhancements (Out of Scope)

- Advanced search filters (by ingredient, cook time, difficulty)
- User authentication and personalized popular recipes
- Recipe ratings and reviews
- Recipe collections/categories
- Share recipe functionality
- Print recipe feature

---

## 15. Notes

- All components must be implemented as React Server Components unless client interactivity is required (e.g., SearchBar)
- Supabase queries should be performed in server components to avoid exposing API keys
- Image assets need to be sourced and added to the project
- Social media URLs need to be provided
- Consider adding a "Skip to main content" link for accessibility

---

## 16. Glossary

- **Hero Section**: The prominent section at the top of a webpage, typically featuring a large image and primary call-to-action
- **Recipe Card**: A compact, clickable UI component displaying summary information about a recipe
- **Responsive Design**: Design approach ensuring optimal viewing experience across devices of varying screen sizes
- **Simple UX**: User experience design philosophy prioritizing clarity, ease of use, and minimal complexity
- **Mobile-First**: Design approach starting with mobile layout and progressively enhancing for larger screens

---

**Document Control**
- Last Updated: November 18, 2025
- Author: GitHub Copilot (on behalf of Kayla Gillam-Wright)
- Review Status: Pending Review
- Next Review Date: Upon implementation completion
