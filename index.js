// fetch("https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients?number=5&ranking=1&ignorePantry=false&ingredients=chicken%252C%20rice%252C%20oregano%252C%20tortillas%252C%20beans", {
// 	"method": "GET",
// 	"headers": {
// 		"x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
// 		"x-rapidapi-key": "c205900701msh88567b5902f4797p1fa7e5jsn95c56c056c11"
// 	}
// })
// .then(response => {
// 	console.log(response);
// })
// .catch(err => {
// 	console.log(err);
// });

const apiKey = "73363f58e09943caa2e10ba4f99bba93";
const recipeSearchURL = "https://api.spoonacular.com/recipes/findByIngredients";
const STORE = [];

//API Functions//

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
	console.log(responseJson);
	for (let i = 0; i < responseJson.length; i++){

//change ingredients to ingredient if responseJson[i].missedIngredientCount === 1
    $('#results-list').append(
      `<li class='recipe-result'><h3>${responseJson[i].title}</h3>

      <p>You're only missing <span class='red'>${responseJson[i].missedIngredientCount}</span> ingredients</p>
      <img src='${responseJson[i].image}' alt='${responseJson[i].title}' width="200">
      </li>`
    )};
  //display the results section
  $('#results').removeClass('hidden');
}

function generateIngString(){
	 const ingredientNameArray = STORE.map(function(item) {
   return item['name'];
});
	 const ingredientString = ingredientNameArray.join(',');
	 console.log("This is the ingredient string: " + ingredientString);
	 return ingredientString;
}


function fetchRecipes() {
	const params = {
		apiKey: apiKey,
		ingredients: generateIngString(),
		ranking: 1,
		ignorePantry: true,
		number: 10
	}
	const queryString = formatQueryParams(params);
	const url = recipeSearchURL + '?' + queryString;
	console.log("This is the url: " + url);


fetch(url)
	.then(response => {
		if (response.ok) {
			return response.json();
		}
		throw new Error(response.statusText);
	})
	.then(responseJson => displayResults(responseJson))
	.catch(err => {
		alert(`Something went wrong: ${err.message}`);
	});

};



//Adding a new ingredient to the DOM
function addNewIngredient(ingredientName) {
	STORE.push({name: ingredientName, id: cuid()});
	$('#ingredientInput').val('');
}

function ingredientHTML(ingredient) {
	return `<li class='listItem' data-item-id='${ingredient.id}'>${ingredient.name}<i class="fa fa-times" aria-hidden="true"></i>
</li>`;
}

function showPantry() {
	$('button.searchButton').removeClass('hidden');
	$('#currentIngredientList').addClass('addBorder');
	$('.listHeader').removeClass('hidden');
}

function hidePantry() {
	$('button.searchButton').addClass('hidden');
	$('#currentIngredientList').removeClass('addBorder');
	$('.listHeader').addClass('hidden');
}

function renderIngredients() {
	$('#currentIngredientList').empty();
	$('#currentIngredientList').append(
		STORE.map(ingredientHTML).join('\n')
	);
	console.log(STORE);
	showPantry();
}

function getItemIdFromElement(item){
  const id = $(item).closest('li').attr("data-item-id");
  return id;
};


function deleteIngredientHandler() {
	$('#currentIngredientList').on('click','.fa-times', e => {
		const itemId = getItemIdFromElement(e.currentTarget);
		const itemIndex = STORE.findIndex(item => item.id === itemId);
		STORE.splice(itemIndex,1);
		renderIngredients();
		handleNoItems();
	})
}

function handleNoItems() {
	if (STORE.length === 0) {
		hidePantry();
	}
}

function inputHandler() {
	$('#ingredientForm').on('keydown','#ingredientInput', e => {

	const TAB_CODE = 9;
	const ENTER_CODE = 13;
	const keyCode = e.keyCode;

	if (keyCode == TAB_CODE || keyCode == ENTER_CODE) {
		e.preventDefault()
		const newIngredient = $('#ingredientInput').val();
		addNewIngredient(newIngredient);
		renderIngredients();
		}
	});
}



function pantrySubmitHandler() {
	$('.searchButton').on('click', e => {
		e.preventDefault();
		fetchRecipes();
	})
};

function onLoad() {
	inputHandler();
	deleteIngredientHandler();
	pantrySubmitHandler();
}

$(onLoad);
