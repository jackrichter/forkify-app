import * as model from "./model.js";
import { MODAL_CLOSE_SEC } from "./config.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";

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

		// 3) update results view to mark selected search result
		resultsView.update(model.getSearchResultsPage());
		// 3) Update bookmarks view
		bookmarksView.update(model.state.bookmarks);

		// 1) Loading recipe
		await model.loadRecipe(id);

		// 2) Rendering recipe
		recipeView.render(model.state.recipe);

		// end try
	} catch (error) {
		recipeView.renderError();
		console.log(error);
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
		resultsView.render(model.getSearchResultsPage());

		// 4) Render initial pagination buttons
		paginationView.render(model.state.search);

		// End try
	} catch (err) {
		console.log(err);
	}
};

/** Pagination controller for buttons clicked */
const controlPagination = function (gotoPage) {
	// Render NEW results
	resultsView.render(model.getSearchResultsPage(gotoPage));

	// Render pagination buttons
	paginationView.render(model.state.search);
};

/** Updating Servings */
const controlServings = function (newServings) {
	// Update the recipe servings in state
	model.updateServings(newServings);

	// Update the recipe view
	// recipeView.render(model.state.recipe);

	/** Update ONLY where the view has CHANGED */
	recipeView.update(model.state.recipe);
};

/** Add Bookmark */
const controlAddBookmark = function () {
	// 1) Add or remove a bookmark
	if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
	else if (model.state.recipe.bookmarked) model.deleteBookmark(model.state.recipe.id);
	// console.log(model.state.recipe);

	// 2) Update the recipe view
	recipeView.update(model.state.recipe);

	// 3) Render bookmarks
	bookmarksView.render(model.state.bookmarks);
};

// To when the app first loads
const controlBookmarks = function () {
	bookmarksView.render(model.state.bookmarks);
};

/** Create new recipe */
const controlAddNewRecipe = async function (newRecipe) {
	try {
		// Show loading spinner
		addRecipeView.renderSpinner();

		// Upload the new recipe
		await model.uploadRecipe(newRecipe);
		// console.log(model.state.recipe);

		// Render the new recipe
		recipeView.render(model.state.recipe);

		// Success message
		addRecipeView.renderMessage();

		// Render bookmark view
		bookmarksView.render(model.state.bookmarks);

		// Change ID in the URL
		window.history.pushState(null, "", `#${model.state.recipe.id}`);

		// Close the modal Form window after a short while
		setTimeout(function () {
			addRecipeView.toggleWindow();
		}, MODAL_CLOSE_SEC * 1000);

		// End try
	} catch (error) {
		console.error("💥", error);
		addRecipeView.renderError(error.message);
	}
};

const newFeature = function () {
	console.log("Welcome to the application");
};

// Handle the event of a Hash Change in the browser's Url field and also the page's load event
const init = function () {
	// Subscribers
	bookmarksView.addHandlerRender(controlBookmarks);
	recipeView.addHandlerRender(controlRecipes);
	recipeView.addHandlerUpdateServings(controlServings);
	recipeView.addHandlerAddBookmark(controlAddBookmark);
	searchView.addHandlerSearch(controlSearchResults);
	paginationView.addHandlerClick(controlPagination);
	addRecipeView.addHandlerUpload(controlAddNewRecipe);
	newFeature();
};
init();

// For debugging under development
const clearBookmarks = function () {
	localStorage.clear("bookmarks");
};
// clearBookmarks();
