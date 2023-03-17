// get recipe data from Spoonacular API
const recipeUrl = "https://api.spoonacular.com/recipes/random?apiKey=35426c9fe86d48c7a5474455805305f0";
const today = new Date().toDateString(); // get current date as string

// check if recipe was shown today
if (localStorage.getItem('lastRecipeDate') === today) {
  // retrieve recipe ID from local storage
  const recipeId = localStorage.getItem('lastRecipeId');
  // fetch recipe details from API using recipe ID
  const recipeDetailsUrl = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=35426c9fe86d48c7a5474455805305f0`;
  fetch(recipeDetailsUrl)
    .then(response => response.json())
    .then(data => {
      // display recipe details
      const recipe = data;
      document.getElementById("recipe-title").innerText = recipe.title;
      document.getElementById("recipe-image").src = recipe.image;
      // display recipe ingredients
      const ingredientsList = document.getElementById("ingredients-list");
      recipe.extendedIngredients.forEach(ingredient => {
        const li = document.createElement("li");
        li.innerText = ingredient.name;
        ingredientsList.appendChild(li);
      });
      // display recipe instructions
      const instructionsList = document.getElementById("instructions-list");
      recipe.analyzedInstructions[0].steps.forEach(step => {
        const li = document.createElement("li");
        li.innerText = step.step;
        instructionsList.appendChild(li);
      });
    })
    .catch(error => console.log(error));
} else {
  // fetch new recipe from API
  fetch(recipeUrl)
    .then(response => response.json())
    .then(data => {
      // save recipe ID and date in local storage
      localStorage.setItem('lastRecipeId', data.recipes[0].id);
      localStorage.setItem('lastRecipeDate', today);
      // display recipe details
      const recipe = data.recipes[0];
      document.getElementById("recipe-title").innerText = recipe.title;
      document.getElementById("recipe-image").src = recipe.image;
      // display recipe ingredients
      const ingredientsList = document.getElementById("ingredients-list");
      recipe.extendedIngredients.forEach(ingredient => {
        const li = document.createElement("li");
        li.innerText = ingredient.name;
        ingredientsList.appendChild(li);
      });
      // display recipe instructions
      const instructionsList = document.getElementById("instructions-list");
      recipe.analyzedInstructions[0].steps.forEach(step => {
        const li = document.createElement("li");
        li.innerText = step.step;
        instructionsList.appendChild(li);
      });
    })
    .catch(error => console.log(error));
}
