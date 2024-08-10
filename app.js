import getRecipeDatabase from './helpers/database.js';

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
        listRecipes();
        form.reset();
        form.title.focus();
    });
}

async function getRecipes() {
    const db = await getRecipeDatabase();
    let recipes = await db.recipes.toArray();
 
    return recipes;
}

async function getRecipe(id) {
    const db = await getRecipeDatabase();
    let recipe = await db.recipes.get(id);

    return recipe;
}

function teste() {}

async function deleteRecipe(id) {
    const db = await getRecipeDatabase();
    db.recipes.delete(recipe).then(() => {
        listValues();
    });
}

function editRecipe(id) {
    const form = document.querySelector('form');
    const recipe = getRecipe(id);
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
          <span style="cursor: pointer" onclick="editRecipe(${recipe.id})">✏️</span>
        </td>
        <td style="width: 30px">
          <span style="cursor: pointer" onclick="deleteRecipe('${recipe.id}')">🗑️</span>
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
