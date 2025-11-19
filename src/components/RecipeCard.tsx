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
