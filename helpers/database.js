export default async function getRecipeDatabase() {
    const { default: Dexie } = await import(
      'https://cdn.jsdelivr.net/npm/dexie@4.0.8/+esm'
    );
    const db = new Dexie('recipeDatabase');

    db.version(2).stores({
      recipes: '++id,title,ingredients,description,time',
    });

    return db;
}
  