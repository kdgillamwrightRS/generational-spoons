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
