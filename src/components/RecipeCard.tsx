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
        <div className="w-full max-w-xs mx-auto flex flex-col h-full">
            <Link href={`/recipes/${recipe.id}`} className="flex-1 flex flex-col h-full">
                <article className="bg-white shadow-md overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer w-full flex flex-col h-full">
                    {/* Recipe Image */}
                    <div className="relative aspect-video w-full" style={{ minHeight: '120px' }}>
                        <Image
                            src={recipe.imageUrl}
                            alt={recipe.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                    </div>
                    {/* Recipe Info */}
                    <div className="p-4 flex-1 flex flex-col justify-center">
                        {/* Recipe Name */}
                        <h3 className="text-xs font-semibold text-yellow-600 mb-3 line-clamp-2 text-center">
                            {recipe.name}
                        </h3>
                    </div>
                </article>
            </Link>
            <div className="flex items-center justify-center gap-4 text-[10px] text-gray-600 bg-white shadow-md py-1 px-2 mt-1 mb-2 w-full">
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
    );
}
