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
    socialLinks?: SocialLink[];
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
