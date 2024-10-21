import { API_URL } from "./config.js";
import { getJSON } from "./helpers.js";

export const state = {
	recipe: {},
	search: {
		query: "",
		results: []
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
