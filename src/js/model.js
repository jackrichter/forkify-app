import { API_URL, RES_PER_PAGE } from "./config.js";
import { getJSON } from "./helpers.js";

export const state = {
	recipe: {},
	search: {
		query: "",
		results: [],
		page: 1,
		resultsPerPage: RES_PER_PAGE
	}
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
