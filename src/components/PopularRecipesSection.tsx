// PopularRecipesSection.js

import RecipeCard from './RecipeCard';
import { getPopularRecipes } from '@/lib/data/recipes';

// We must import the client-side wrapper to use state/interactivity
import ClientFilterDropdown from './ClientFilterDropdown';

interface PopularRecipesSectionProps {
    limit?: number;
}

// Define the options for the dropdown
const filterOptions = [
    { value: '', label: 'Protein' },
    { value: 'chicken', label: 'Chicken' },
    { value: 'pork', label: 'Pork' },
    { value: 'beef', label: 'Beef' },
    { value: 'fish', label: 'Fish' },
    { value: 'vegetarian', label: 'Vegetarian' },
];


export default async function PopularRecipesSection({
    limit = 6
}: PopularRecipesSectionProps) {
    // Server Component - direct async data fetching
    // NOTE: If you pass a 'filter' prop here, you'd fetch filtered data
    const recipes = await getPopularRecipes(limit);

    // Handle empty state
    if (recipes.length === 0) {
        return (
            <section className="">
                <div className="bg-white mx-auto">
                    <p className="text-gray-600">Sorry, there are no recipes available at this time.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-white/80">
            <div className="bg-white/80">
                {/* Filter Bar */}
                <div className="flex items-center justify-center gap-6 mb-4 py-1 bg-white/80 border-b border-gray-200 w-full">
                    <span className="text-[12px] font-semibold text-gray-500 h-7 flex items-center">{recipes.length} Recipes</span>

                    {/* The interactive FilterDropdown is wrapped in a Client Component 
                        to manage the open/closed state and selection.
                    */}
                    <ClientFilterDropdown
                        label="Sort by"
                        initialValue=""
                        options={filterOptions} onSelect={undefined}                    // In a real application, you would pass a function here 
                    // to handle the sorting/filtering of the recipes, perhaps 
                    // by using a URL search parameter (`useSearchParams`).
                    />
                </div>
                {/* Recipe Grid */}
                <div className="px-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 bg-white/80 custom-cols-1-under-500 items-stretch recipe-grid-full-height">
                    {recipes.map((recipe) => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                </div>
            </div>
        </section>
    );
}