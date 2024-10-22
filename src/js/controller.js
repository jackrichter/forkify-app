import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";

import "core-js/stable"; // Polyfill everything else
import "regenerator-runtime/runtime"; // Polyfill async/await

// https://forkify-api.herokuapp.com/v2

// From Parcel
// if (module.hot) {
// 	module.hot.accept();
// }

///////////////////////////////////////

/** Recipe Functionality */
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
		recipeView.renderError();
	}
};

/** Search Functionality */
const controlSearchResults = async function () {
	try {
		resultsView.renderSpinner();

		// 1) Get search query
		const query = searchView.getQuery();
		if (!query) return;

		// 2) Load search results
		await model.loadSearchResults(query);

		// 3) Render results with pagination
		// console.log(model.state.search.results);
		// resultsView.render(model.state.search.results);
		resultsView.render(model.getSearchResultsPage());

		// End try
	} catch (err) {
		console.log(err);
	}
};

// Handle the event of a Hash Change in the browser's Url field and also the page's load event
const init = function () {
	// Subscribers
	recipeView.addHandlerRender(controlRecipes);
	searchView.addHandlerSearch(controlSearchResults);
};
init();
