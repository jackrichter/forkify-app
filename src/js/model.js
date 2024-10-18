export const state = {
	recipe: {}
};

// Remember: an ASYNC function returns a Promise. Therefore the calling function must AWAIT that Promise!!!
export const loadRecipe = async function (id) {
	try {
		const res = await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes/${id}`);
		const data = await res.json();

		if (!res.ok) throw new Error(`${data.message} (${res.status})`);
		console.log(res, data);

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

		console.log(state.recipe);

		// end of try
	} catch (err) {
		alert(err);
	}
};
