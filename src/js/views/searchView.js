import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {         // we are not returning anything so we wrap the code in curly brackets
	elements.searchInput.value = '';
};

export const clearResults = () => {        
	elements.searchResList.innerHTML = '';
};

/*
// Pasta with tomato and spinach
acc: 0 / acc + cur.length = 5 / newTitle = ['Pasta']
acc: 5 / acc + cur.length = 9 / newTitle = ['Pasta', 'with']
acc: 9 / acc + cur.length = 15 / enwTitle = ['Pasta', 'with', 'tomato']
acc: 15 / acc + cur.length = 18 / enwTitle = ['Pasta', 'with', 'tomato']
acc: 18 / acc + cur.length = 24 / enwTitle = ['Pasta', 'with', 'tomato']
*/

const limitRecipeTitle = (title, limit = 17) => {
	const newTitle = [];
	if (title.length > limit) {
		title.split(' ').reduce((acc, cur) => {
			if (acc + cur.length <= limit) {
				newTitle.push(cur);
			}

			return acc + cur.length;

		}, 0);

		// return result
		return `${newTitle.join(' ')} ...`;
	} 
	return title;
} 


const renderRecipe = recipe => {
	const markup = `
	<li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
	`;

	elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

export const renderResults = recipes => {
	recipes.forEach(renderRecipe);
};