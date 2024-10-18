import * as model from "./model.js";
import recipeView from "./views/recipeView.js";

import "core-js/stable"; // Polyfill everything else
import "regenerator-runtime/runtime"; // Polyfill async/await

const recipeContainer = document.querySelector(".recipe");

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
	try {
		// Fetch the recipes hashed id from the app's Url field
		const id = window.location.hash.slice(1);
		// console.log(id);

		// Guard clause
		if (!id) return;

		// Render a spinner
		recipeView.renderSpinner();

		// 1) Loading recipe
		await model.loadRecipe(id);

		// 2) Rendering recipe
		recipeView.render(model.state.recipe);

		// end try
	} catch (error) {
		alert(error);
	}
};

// Handle the event of a Hash Change in the browser's Url field and also the page's load event
["hashchange", "load"].forEach(ev => window.addEventListener(ev, controlRecipes));
