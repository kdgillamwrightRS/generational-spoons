// All Recipes index page
// Fetches and displays all recipes in a responsive grid


import { getAllRecipes } from '../../lib/data/recipes';
import { Recipe } from '../../lib/types';
import AllRecipesClient from './AllRecipesClient';


const AllRecipesPage = async () => {
    const recipes: Recipe[] = await getAllRecipes();
    return <AllRecipesClient recipes={recipes} />;
};

export default AllRecipesPage;
