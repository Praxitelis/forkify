import 'babel-polyfill';   
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import { elements, renderLoader, clearLoader } from './views/base';



// Global state of the app

//	-Search object
//	-current recipe object
//	-shopping list object
//	-liked recipes

const state = {};
window.state = state;  // to have access to the state for testing purposes 

/* 
/// SEARCH CONTROLLER
*/
const controlSearch = async () => {
	// 1 - Get query from view
	const query = searchView.getInput();
	

	if (query) {
		// 2 - new search object and add to state
		state.search = new Search(query);

		// 3 - Prepare UI for results
		searchView.clearInput();
		searchView.clearResults();
		renderLoader(elements.searchRes);

		try {
		// 4 - Search for recipes
		await state.search.getResults();

		// 5 - render results on UI
		clearLoader();
		searchView.renderResults(state.search.result);
		} catch (err) {
			alert('Something went wrong with the search...');
			clearLoader();
		}

	}
}

elements.searchForm.addEventListener('submit', e => {
	e.preventDefault(); // stop the page from reloading
	controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
	const btn = e.target.closest('.btn-inline');
	if (btn) {
		const goToPage = parseInt(btn.dataset.goto, 10);  // access to data
		searchView.clearResults();
		searchView.renderResults(state.search.result, goToPage);
	}
})


/* 
/// RECIPE CONTROLLER
*/

const controlRecipe = async () => {
	// Get ID from url
	const id = window.location.hash.replace('#', ''); // removing the hash since we only need the id

	if (id) {
		// Prepare the UI for changes 
		recipeView.clearRecipe();
		renderLoader(elements.recipe);


		// Highlight selected search item
		if (state.search) searchView.highlightSelected(id);


		// Create new recipe object
		state.recipe = new Recipe(id);


			try{
			// Get recipe data
			await state.recipe.getRecipe();
			state.recipe.parseIngredients();
			// Calculate data

			//Calculate servings and time
			state.recipe.calcTime();
			state.recipe.calcServings();
			// Render recipe
			clearLoader();
			recipeView.renderRecipe(state.recipe);
		} catch(err) {
			alert('Error while generating the recipe!');

	  }

	}
};

/*window.addEventListener('hashchange', controlRecipe);
window.addEventListener('load', controlRecipe);*/
// Or we can write it in one line like below
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));



/**
 * LIST CONTROLLER
*/

const controlList = () => {
	//create a new list If there is none yet created
	if (!state.list) state.list = new List();

	//Add each ingredient to the List
	state.recipe.ingredients.forEach(el => {
		const item = state.list.addItem(el.count, el.unit, el.ingredient);
		listView.renderItem(item);
	});
}

//handle delete and update list item events
elements.shopping.addEventListener('click', e => {
	const id = e.target.closest('.shopping__item').dataset.itemid;

	// Handle the delete button
	if (e.target.matches('.shopping__delete, .shopping__delete *')) {
		//Delete from state
		state.list.deleteItem(id);
		//Delete from UI
		listView.deleteItem(id);

		//Handle the count update
	} else if (e.target.matches('.shopping__count-value')) {
		const val = parseFloat(e.target.value, 10);
		state.list.updateCount(id, val);
	}
});







//EVENT DELEGATION
//buttons that are not present before loading a recipe

// Handling recipe button clicks ------------------  the star means any child of the btn-decrease. Its a universal selector
elements.recipe.addEventListener('click', e=> {
	if (e.target.matches('.btn-decrease, .btn-decrease *')) {
		// Decrease btn is clicked
		if (state.recipe.servings > 1) {
		state.recipe.updateServings('dec');
		recipeView.updateServingsIngredients(state.recipe);
		}
	} else if (e.target.matches('.btn-increase, .btn-increase *')) { 
		// Increase btn is clicked
		state.recipe.updateServings('inc');
		recipeView.updateServingsIngredients(state.recipe);

	} else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
		controlList();
	}
	        
});


window.l = new List();