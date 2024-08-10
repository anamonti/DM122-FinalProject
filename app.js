import getRecipeDatabase from './helpers/database.js';
import registerServiceWorker from './helpers/install-sw.js';

listRecipes();

const form = document.querySelector('form');
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    addRecipe(form.title.value, form.ingredients.value, form.description.value, form.time.value);
});

async function addRecipe(title, ingredients, description, time) {
    const recipe = { title, ingredients, description, time };
    const db = await getRecipeDatabase();
    db.recipes.put(recipe).then(() => {
        console.log("recipe added")
        listRecipes();
        form.reset();
        form.title.focus();
        form.title.disabled = false;
    });
}

async function getRecipes() {
    const db = await getRecipeDatabase();
    let recipes = await db.recipes.toArray();
 
    return recipes;
}

async function getRecipe(title) {
    const db = await getRecipeDatabase();
    let recipe = await db.recipes.get(title);

    return recipe;
}

function teste() {}

export async function deleteRecipe(recipeTitle) {
    if (confirm('Are you sure you want to delete this recipe?')) {
        const recipe = await getRecipe(recipeTitle);
        const db = await getRecipeDatabase();
        db.recipes.where("title").equals(recipe.title).delete().then(() => {
            console.log("delete")
            listRecipes();
        });
    }
}

export async function editRecipe(recipeTitle) {
    const form = document.querySelector('form');
    const recipe = await getRecipe(recipeTitle);
    form.title.disabled = true;
    form.title.value = recipe.title;
    form.ingredients.value = recipe.ingredients;
    form.description.value = recipe.description;
    form.time.value = recipe.time;
}

async function listRecipes() {
    let recipes = await getRecipes();

    if(!recipes.length) {
        resetTable();
        return;
    }

    const allValues = recipes.map(toHTML).join('');

    addToHTML(allValues);
}

function toHTML(recipe) {
    const html = `
      <tr>
        <th scope="row">${recipe.title}</th>
        <td>${recipe.ingredients}</td>
         <td>${recipe.description}</td>
          <td>${recipe.time}</td>
        <td style="width: 30px">
          <span style="cursor: pointer" onclick="editRecipe('${recipe.title}')">✏️</span>
        </td>
        <td style="width: 30px">
          <span style="cursor: pointer" onclick="deleteRecipe('${recipe.title}')">🗑️</span>
        </td>
      </tr>
    `;
    return html;
}

function addToHTML(allValues) {
    const listValues = document.getElementById('listValues');
    listValues.innerHTML = '';
    listValues.insertAdjacentHTML('beforeend', allValues);
}

function resetTable() {
    const listValues = document.getElementById('listValues');
    listValues.innerHTML = '<td colSpan="4">No data available</td>';
}

registerServiceWorker();