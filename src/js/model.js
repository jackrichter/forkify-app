import { API_URL, RES_PER_PAGE } from "./config.js";
import { getJSON } from "./helpers.js";

export const state = {
	recipe: {},
	search: {
		query: "",
		results: [],
		page: 1,
		resultsPerPage: RES_PER_PAGE
	},
	bookmarks: []
};

// Remember: an ASYNC function returns a Promise. Therefore the calling function must AWAIT that Promise!!!
export const loadRecipe = async function (id) {
	try {
		const data = await getJSON(`${API_URL}${id}`);
		// console.log(data);

		// Create a recipe object
		const { recipe } = data.data;
		// let recipe = Object.assign({}, data.data.recipe);

		state.recipe = {
			id: recipe.id,
			title: recipe.title,
			publisher: recipe.publisher,
			sourceUrl: recipe.source_url,
			image: recipe.image_url,
			servings: recipe.servings,
			cookingTime: recipe.cooking_time,
			ingredients: recipe.ingredients
		};
		// console.log(state.recipe);

		// Check if this loaded recipe is in the BOOKMARKS array in order to keep this state between loads
		if (state.bookmarks.some(bookmark => bookmark.id === id)) {
			state.recipe.bookmarked = true;
		} else {
			state.recipe.bookmarked = false;
		}

		// end of try
	} catch (err) {
		throw err;
	}
};

/** Search Functionality */

export const loadSearchResults = async function (query) {
	try {
		state.search.query = query;

		const data = await getJSON(`${API_URL}?search=${query}`);
		// console.log(data);

		state.search.results = data.data.recipes.map(rec => {
			return {
				id: rec.id,
				title: rec.title,
				publisher: rec.publisher,
				image: rec.image_url
			};
		});
		state.search.page = 1;

		// End try
	} catch (err) {
		console.error(`${err} 💥💥`);
		throw err;
	}
};

/** Pagination */
export const getSearchResultsPage = function (page = state.search.page) {
	state.search.page = page;

	const start = (page - 1) * state.search.resultsPerPage; // if page 1 => 0
	const end = page * state.search.resultsPerPage; // if page 1 => 10

	return state.search.results.slice(start, end); // slice: end not including => 0, 9
};

/** Updating Servings */
export const updateServings = function (newServings) {
	// Algorithm: newQty = oldQty * newServings / oldServings
	state.recipe.ingredients.forEach(ing => {
		ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
	});

	state.recipe.servings = newServings;
};

/** Bookmarks */
export const addBookmark = function (recipe) {
	// Add a bookmark
	state.bookmarks.push(recipe);

	// Mark current recipe as bookmarked
	if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
};

export const deleteBookmark = function (id) {
	// Find index in the array for the entry to be removed
	const index = state.bookmarks.findIndex(element => element.id === id);

	// Remove from array
	state.bookmarks.splice(index, 1);

	// Mark current recipe as NOT bookmarked
	if (id === state.recipe.id) state.recipe.bookmarked = false;
};
