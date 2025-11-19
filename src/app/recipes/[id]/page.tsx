import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getRecipeDetail } from '@/lib/data/recipes';
import type { Metadata } from 'next';

// ============================================================================
// RECIPE DETAIL PAGE
// ============================================================================
// Purpose: Display full recipe with directions and ingredients
// Type: Async Server Component
// Data Source: Supabase recipes table with JSONB columns
// ============================================================================

type RecipePageProps = {
    params: Promise<{
        id: string;
    }>;
};

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: RecipePageProps): Promise<Metadata> {
    const { id } = await params;
    const recipe = await getRecipeDetail(id);

    if (!recipe) {
        return {
            title: 'Recipe Not Found',
        };
    }

    return {
        title: `${recipe.name} | Generational Spoons`,
        description: recipe.description,
    };
}

export default async function RecipePage({ params }: RecipePageProps) {
    const { id } = await params;
    const recipe = await getRecipeDetail(id);

    // Handle recipe not found
    if (!recipe) {
        notFound();
    }

    // Helper function to format time
    const formatTime = (minutes: number): string => {
        if (minutes < 60) {
            return `${minutes} min`;
        }
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours} hr ${mins} min` : `${hours} hr`;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Back Navigation */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-4">
                    <Link
                        href="/"
                        className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                        Back to Recipes
                    </Link>
                </div>
            </div>

            {/* Recipe Header */}
            <div className="bg-white">
                <div className="container mx-auto px-4 py-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Recipe Image */}
                        <div className="relative aspect-4/3 rounded-lg overflow-hidden">
                            <Image
                                src={recipe.imageUrl}
                                alt={recipe.name}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>

                        {/* Recipe Info */}
                        <div className="flex flex-col justify-center">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                {recipe.name}
                            </h1>

                            <p className="text-lg text-gray-600 mb-6">
                                {recipe.description}
                            </p>

                            {/* Recipe Stats */}
                            <div className="flex gap-6 mb-6">
                                <div className="flex items-center text-gray-700">
                                    <svg
                                        className="w-5 h-5 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    <span className="font-medium">{formatTime(recipe.totalTime)}</span>
                                </div>

                                <div className="flex items-center text-gray-700">
                                    <svg
                                        className="w-5 h-5 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                        />
                                    </svg>
                                    <span className="font-medium">{recipe.ingredientCount} ingredients</span>
                                </div>

                                {recipe.rating && (
                                    <div className="flex items-center text-gray-700">
                                        <svg
                                            className="w-5 h-5 mr-2 text-yellow-500"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                        </svg>
                                        <span className="font-medium">{recipe.rating.toFixed(1)}</span>
                                    </div>
                                )}
                            </div>

                            {/* Print Button */}
                            <button
                                onClick={() => window.print()}
                                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <svg
                                    className="w-5 h-5 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                                    />
                                </svg>
                                Print Recipe
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recipe Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Ingredients Section */}
                    <div className="md:col-span-1 bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Ingredients
                        </h2>
                        <ul className="space-y-3">
                            {recipe.full_ingredients.map((ingredient, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 shrink-0" />
                                    <div className="flex-1">
                                        <span className="text-gray-900">
                                            {ingredient.amount > 0 && (
                                                <>
                                                    {ingredient.amount}{' '}
                                                    {ingredient.unit}{' '}
                                                </>
                                            )}
                                            {ingredient.name}
                                        </span>
                                        {ingredient.notes && (
                                            <span className="text-gray-600 text-sm ml-1">
                                                ({ingredient.notes})
                                            </span>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Directions Section */}
                    <div className="md:col-span-2 bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Directions
                        </h2>
                        <ol className="space-y-6">
                            {recipe.directions.map((direction) => (
                                <li key={direction.step} className="flex">
                                    <span className="shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                                        {direction.step}
                                    </span>
                                    <p className="text-gray-700 pt-1 flex-1">
                                        {direction.instruction}
                                    </p>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
}
