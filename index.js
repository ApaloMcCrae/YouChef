// //
//
// fetch("https://edamam-recipe-search.p.rapidapi.com/search?q=chicken", {
// 	"method": "GET",
// 	"headers": {
// 		"x-rapidapi-host": "edamam-recipe-search.p.rapidapi.com",
// 		"x-rapidapi-key": "233f3f3c3amshcd0f9bc8347421dp101e1ejsnae13d51c879b"
// 	}
// })
// .then(response => {
// 	console.log(response);
// })
// .catch(err => {
// 	console.log(err);
// });
//

const STORE = [];

function addNewIngredient(ingredientName) {
	STORE.push({name: ingredientName, id: cuid()});
	$('#ingredientInput').val('');
}

function ingredientHTML(ingredient) {
	return `<li class='listItem' data-item-id='${ingredient.id}'>${ingredient.name}</li>`;
}

function renderIngredients() {
	$('#currentIngredientList').empty();
	$('#currentIngredientList').append(
		STORE.map(ingredientHTML).join('\n')
	);
	console.log(STORE);
	$('button.searchButton').removeClass('hidden');
}

function getItemIdFromElement(item){
  const id = $(item).closest('li').attr("data-item-id");
  return id;
};


function deleteIngredient() {
	$('#currentIngredientList').on('click','.listItem', e => {
		console.log(e.currentTarget);
		const itemId = getItemIdFromElement(e.currentTarget);
		console.log("ID of current item is:" + itemId);
		const itemIndex = STORE.findIndex(item => item.id === itemId);
		STORE.splice(itemIndex,1);
		renderIngredients();
	})
}
function onLoad() {
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

	deleteIngredient();
}

$(onLoad);
