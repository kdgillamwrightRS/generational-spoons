"use client";



import React, { useState } from 'react';

import dynamic from 'next/dynamic';
const ClientFilterDropdown = dynamic(() => import('../../components/ClientFilterDropdown'), { ssr: false });
const SearchBar = dynamic(() => import('../../components/SearchBar'), { ssr: false });



import RecipeCard from '../../components/RecipeCard';
import './custom-grid.css';
import { Recipe } from '../../lib/types';

interface AllRecipesClientProps {
    recipes: Recipe[];
}


export default function AllRecipesClient({ recipes }: AllRecipesClientProps) {
    // Filter state
    const [mainFilter, setMainFilter] = useState<'all' | 'protein' | 'meal'>('all');
    const [proteinFilter, setProteinFilter] = useState('chicken');
    const [mealFilter, setMealFilter] = useState('breakfast');

    // Dropdown options
    const mainFilterOptions = [
        { label: 'All', value: 'all' },
        { label: 'Protein', value: 'protein' },
        { label: 'Meal', value: 'meal' },
    ];
    const proteinOptions = [
        { label: 'Chicken', value: 'chicken' },
        { label: 'Beef', value: 'beef' },
        { label: 'Pork', value: 'pork' },
        { label: 'Fish', value: 'fish' },
        { label: 'Seafood', value: 'seafood' },
        { label: 'Vegetarian', value: 'vegetarian' },
        { label: 'Vegan', value: 'vegan' },
        { label: 'Other', value: 'other' },
    ];
    const mealOptions = [
        { label: 'Breakfast', value: 'breakfast' },
        { label: 'Lunch', value: 'lunch' },
        { label: 'Dinner', value: 'dinner' },
        { label: 'Drinks', value: 'drinks' },
        { label: 'Dessert', value: 'dessert' },
    ];

    return (
        <main className="px-4 py-8 bg-white min-h-screen">
            <h1 className="text-3xl text-gray-700 font-bold mb-4">Recipes</h1>
            {/* Search and filter controls */}
            <div className="flex flex-row md:items-center md:justify-between gap-4 mb-6">
                <div className="flex gap-2 items-center">
                    <ClientFilterDropdown
                        label="Filter by"
                        options={mainFilterOptions}
                        initialValue={mainFilter}
                        onSelect={setMainFilter}
                    />
                    {/* Show sub-filter if needed */}
                    {mainFilter === 'protein' && (
                        <ClientFilterDropdown
                            label="Protein"
                            options={proteinOptions}
                            initialValue={proteinFilter}
                            onSelect={setProteinFilter}
                        />
                    )}
                    {mainFilter === 'meal' && (
                        <ClientFilterDropdown
                            label="Meal"
                            options={mealOptions}
                            initialValue={mealFilter}
                            onSelect={setMealFilter}
                        />
                    )}
                </div>
                <div className="flex-1">
                    <SearchBar placeholder="Search recipes..." />
                </div>
            </div>
            <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid-cols-custom-xs">
                {recipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
            </div>
        </main>
    );
}
