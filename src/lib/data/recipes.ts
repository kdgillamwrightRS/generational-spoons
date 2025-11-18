import { supabase } from '@/lib/supabase/server';
import { Recipe, RecipeDetail } from '@/lib/types';

/**
 * Fallback recipe data (used when database is unavailable)
 */
const FALLBACK_RECIPES: Recipe[] = [
    {
        id: '1',
        name: 'Grandma\'s Apple Pie',
        imageUrl: 'https://placehold.co/800x600/fef3c7/92400e?text=Apple+Pie&font=roboto',
        totalTime: 120,
        ingredientCount: 8,
    },
    {
        id: '2',
        name: 'Classic Chocolate Chip Cookies',
        imageUrl: 'https://placehold.co/800x600/fed7aa/9a3412?text=Chocolate+Cookies&font=roboto',
        totalTime: 45,
        ingredientCount: 12,
    },
    {
        id: '3',
        name: 'Sunday Pot Roast',
        imageUrl: 'https://placehold.co/800x600/fecaca/991b1b?text=Pot+Roast&font=roboto',
        totalTime: 240,
        ingredientCount: 15,
    },
    {
        id: '4',
        name: 'Homemade Margherita Pizza',
        imageUrl: 'https://placehold.co/800x600/fee2e2/dc2626?text=Margherita+Pizza&font=roboto',
        totalTime: 30,
        ingredientCount: 7,
    },
    {
        id: '5',
        name: 'Creamy Chicken Alfredo',
        imageUrl: 'https://placehold.co/800x600/fef9c3/854d0e?text=Chicken+Alfredo&font=roboto',
        totalTime: 35,
        ingredientCount: 10,
    },
    {
        id: '6',
        name: 'Classic Caesar Salad',
        imageUrl: 'https://placehold.co/800x600/d9f99d/365314?text=Caesar+Salad&font=roboto',
        totalTime: 20,
        ingredientCount: 9,
    },
];

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
            // Only log on server-side (not in browser console)
            if (typeof window === 'undefined') {
                console.error('Error fetching popular recipes:', error);
            }
            // Return fallback data instead of throwing
            return FALLBACK_RECIPES.slice(0, limit);
        }

        // Data validation and type safety
        if (!data || data.length === 0) {
            return FALLBACK_RECIPES.slice(0, limit);
        }

        // Return properly typed data
        return data as Recipe[];

    } catch (error) {
        // Only log on server-side
        if (typeof window === 'undefined') {
            console.error('Unexpected error in getPopularRecipes:', error);
        }
        // Return fallback data for graceful degradation
        return FALLBACK_RECIPES.slice(0, limit);
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

/**
 * Fetch full recipe details including directions and ingredients
 * 
 * Used for recipe detail pages to display complete cooking instructions
 * and ingredient lists from JSONB columns.
 * 
 * @param id - Recipe ID
 * @returns RecipeDetail object with directions and full_ingredients or null
 */
export async function getRecipeDetail(id: string): Promise<RecipeDetail | null> {
    try {
        const { data, error } = await supabase
            .from('recipes')
            .select('id, name, imageUrl, totalTime, ingredientCount, description, directions, full_ingredients, viewCount, rating, createdAt, updatedAt')
            .eq('id', id)
            .single();

        if (error) {
            console.error(`Error fetching recipe detail ${id}:`, error);
            return null;
        }

        if (!data) {
            return null;
        }

        // Type assertion with JSONB fields
        return data as RecipeDetail;

    } catch (error) {
        console.error('Unexpected error in getRecipeDetail:', error);
        return null;
    }
}
