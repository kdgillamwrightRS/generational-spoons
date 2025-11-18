import { supabase } from '@/lib/supabase/server';
import { Recipe, RecipeDetail } from '@/lib/types';

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
