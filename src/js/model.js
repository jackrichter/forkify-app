import { API_URL, RES_PER_PAGE, KEY } from "./config.js";
import { getJSON, sendJSON } from "./helpers.js";

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

const createRecipeObject = function (data) {
	const { recipe } = data.data;
	return {
		id: recipe.id,
		title: recipe.title,
		publisher: recipe.publisher,
		sourceUrl: recipe.source_url,
		image: recipe.image_url,
		servings: recipe.servings,
		cookingTime: recipe.cooking_time,
		ingredients: recipe.ingredients,
		bookmarked: false,
		// Conditionally add the key to the recipe object
		...(recipe.key && { key: recipe.key })
	};
};

// Remember: an ASYNC function returns a Promise. Therefore the calling function must AWAIT that Promise!!!
export const loadRecipe = async function (id) {
	try {
		const data = await getJSON(`${API_URL}${id}`);
		// console.log(data);

		// Create a recipe object
		state.recipe = createRecipeObject(data);
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

	// Persist in Local Storage
	persistBookmark();
};

export const deleteBookmark = function (id) {
	// Find index in the array for the entry to be removed
	const index = state.bookmarks.findIndex(element => element.id === id);

	// Remove from array
	state.bookmarks.splice(index, 1);

	// Mark current recipe as NOT bookmarked
	if (id === state.recipe.id) state.recipe.bookmarked = false;

	// Persist in Local Storage
	persistBookmark();
};

/** Local Storage */
const persistBookmark = function () {
	localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

/** Uploading the newly created recipe */
export const uploadRecipe = async function (newRecipe) {
	try {
		// 1) Transform the raw input data into the same format as the data coming from the external api
		const ingredients = Object.entries(newRecipe)
			.filter(entry => entry[0].startsWith("ingredient") && entry[1] !== "")
			.map(ing => {
				const ingArr = ing[1].replaceAll(" ", "").split(",");
				if (ingArr.length != 3)
					throw new Error("Wrong ingredient format! Please use the correct format ;)");
				const [quantity, unit, description] = ingArr;
				return { quantity: quantity ? +quantity : null, unit, description };
			});

		// 2) Create the object that is ready to be uploaded
		const recipe = {
			title: newRecipe.title,
			source_url: newRecipe.sourceUrl,
			image_url: newRecipe.image,
			publisher: newRecipe.publisher,
			cooking_time: +newRecipe.cookingTime,
			servings: +newRecipe.servings,
			ingredients
		};
		// console.log(recipe);

		// 3) AJAX Request (POST)
		const data = await sendJSON(`${API_URL}?key=${KEY}`, recipe);

		// 4) Retain the uploaded data in app's own state in order to display it to the user
		state.recipe = createRecipeObject(data);

		// Bookmark this recipe
		state.recipe.bookmarked = true;
		addBookmark(recipe);

		// End try
	} catch (error) {
		throw error;
	}
};

const init = function () {
	const storage = localStorage.getItem("bookmarks");
	if (storage) {
		state.bookmarks = JSON.parse(storage);
	}
};
init();
// console.log(state.bookmarks);
