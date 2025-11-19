import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getRecipeDetail } from '@/lib/data/recipes';
import type { Metadata } from 'next';
import PrintRecipeButton from '@/components/PrintRecipeButton';

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
        <div className="min-h-screen bg-gray-50 print:bg-white print:text-black print:p-2 print:m-0 print:min-h-0 print:h-auto print:w-full print:overflow-visible print:text-xs">
            {/* Back Navigation */}
            <div className="bg-white border-b print:border-0 print:p-0 print:m-0">
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
            <div className="bg-white print:bg-white print:p-0 print:m-0">
                <div className="container mx-auto px-4 py-8 print:px-1 print:py-2">
                    <div className="grid md:grid-cols-2 gap-8 print:grid-cols-1 print:gap-2">
                        {/* Recipe Image (hidden when printing) */}
                        <div className="relative aspect-4/3 rounded-lg overflow-hidden print:hidden">
                            <Image
                                src={recipe.imageUrl}
                                alt={recipe.name}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>

                        {/* Recipe Info */}
                        <div className="flex flex-col justify-center print:items-start print:text-xs print:mb-2">
                            <h1 className="text-2xl font-bold text-gray-900 mb-4 print:text-base print:mb-2">
                                {recipe.name}
                            </h1>

                            <p className="text-sm text-gray-600 mb-6 print:text-xs print:mb-2">
                                {recipe.description}
                            </p>

                            {/* Recipe Stats */}
                            <div className="flex gap-6 mb-6 print:gap-2 print:mb-2">
                                <div className="flex items-center text-gray-700 text-sm">
                                    <svg
                                        className="w-4 h-4 mr-2"
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

                                <div className="flex items-center text-gray-700 text-sm">
                                    <svg
                                        className="w-4 h-4 mr-2"
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

                                {/* Star rating removed */}
                            </div>

                            {/* Print Button */}
                            <PrintRecipeButton />
                        </div>
                    </div>
                </div>
            </div>

            {/* Recipe Content */}
            <div className="container mx-auto py-4 print:px-1 print:py-2">
                <div className="grid md:grid-cols-3 gap-4 print:grid-cols-1 print:gap-2">
                    {/* Ingredients Section */}
                    <div className="md:col-span-1 bg-white rounded-lg shadow-sm p-4 print:p-2 print:mb-2 print:shadow-none print:rounded-none">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 print:text-base print:mb-2">
                            Ingredients
                        </h2>
                        <ul className="space-y-3 print:space-y-1">
                            {recipe.full_ingredients.map((ingredient, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 shrink-0" />
                                    <div className="flex-1">
                                        <span className="text-gray-900 text-[12px] font-medium">
                                            {ingredient.amount > 0 && (
                                                <>
                                                    {ingredient.amount}{' '}
                                                    {ingredient.unit}{' '}
                                                </>
                                            )}
                                            {ingredient.name}
                                        </span>
                                        {ingredient.notes && (
                                            <div className="text-gray-600 text-[12px] leading-tight">
                                                {ingredient.notes}
                                            </div>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Directions Section */}
                    <div className="md:col-span-2 bg-white rounded-lg shadow-sm p-4 print:p-2 print:shadow-none print:rounded-none">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 print:text-base print:mb-2">
                            Directions
                        </h2>
                        <ol className="space-y-6 print:space-y-1">
                            {recipe.directions.map((direction) => (
                                <li key={direction.step} className="flex">
                                    <span className="shrink-0 w-6 h-6 bg-blue-600 text-sm text-white rounded-full flex items-center justify-center font-bold mr-4">
                                        {direction.step}
                                    </span>
                                    <p className="text-gray-700 pt-1 flex-1 text-[12px] font-medium">
                                        {direction.instruction}
                                    </p>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
        </div >
    );
}
