import getRecipeDatabase from './helpers/database.js';

async function addRecipe(title, ingredients, description, time) {
    const recipe = { title, ingredients, description, time };
    const db = await getRecipeDatabase();
    db.recipes.add(recipe).then((result) => recipe.id = result);
}

const form = document.querySelector('form');
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  addRecipe(form.title.value, form.ingredients.value, form.description.value, form.time.value);
});