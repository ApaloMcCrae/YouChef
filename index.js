const apiKey = "73363f58e09943caa2e10ba4f99bba93";
const recipeByIngSearchURL = "https://api.spoonacular.com/recipes/findByIngredients";
const basicRecipeSearchURL = 'https://api.spoonacular.com/recipes/search';
const bulkRecipeSearchURL = 'https://api.spoonacular.com/recipes/informationBulk';
const STORE = [];


//API Fetch Functions//

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}


//<a href="${responseJson[i].infoData.sourceUrl}" target="_blank">

function displayResults(responseJson) {
  console.log(responseJson);
	$('#results-list').empty();

	for (let i = 0; i < responseJson.length; i++){

//change ingredients to ingredient if responseJson[i].missedIngredientCount === 1
    $('#results-list').append(
      `<li class='recipe-result' data-item-id='${responseJson[i].id}'>
          <div class='recipe-image modal-trigger' style="background:linear-gradient(rgba(0, 0, 0, 0),rgba(0, 0, 0, 0.0),rgba(0, 0, 0, 0.4),rgba(0, 0, 0, 0.9)),url(${responseJson[i].image});background-size: contain;background-position: center center;">
            <div class="readyInMin"><i class="fa fa-clock-o" aria-hidden="true"></i><p class="minutesText">${responseJson[i].infoData.readyInMinutes}min</p></div>
            <h3 class="recipe-name">${responseJson[i].title}</h3>
            <p class='missing-ingredients'>You're only missing <span class='green'> ${responseJson[i].missedIngredientCount}</span> ingredients</p>
          </div>
      </li>`
    )};

  //display the results section
  hideLoader();
  $('#results').removeClass('hidden');

  function openModalHandler() {
    $('#results-list').on('click','.recipe-result', function(e) {
      e.preventDefault();
      const recipeId = $(e.currentTarget).data('item-id');
      console.log("This is the ID of recipe that was just clicked: " + recipeId);
      const recipeObj = responseJson.find(obj => obj.id === recipeId);
      console.log(recipeObj);
      //$('.modal .recipeImage').css("background":`linear-gradient(rgba(0, 0, 0, 0),rgba(0, 0, 0, 0.0),rgba(0, 0, 0, 0.4),rgba(0, 0, 0, 0.9)),url(${recipeObj.image})`,"background-size" : "contain", "background-position" : "center center");
      $('.modal .recipeTitle').text(recipeObj.title);
      $('.modal .recipeSummary').html(recipeObj.infoData.summary);
      let usedIngredients = '';
      for (let i = 0; i < recipeObj.usedIngredientCount; i++) {
        if (i > 0 && i == (recipeObj.usedIngredientCount - 1)) {
          usedIngredients += "and";
        }
        usedIngredients += recipeObj.usedIngredients[i].name;
      };
      $('.modal .usedIngredients').append(`<span class = "green">${usedIngredients}</span>`);
      $('.modal').addClass('modal--show');
});
  };
//
openModalHandler();
};

function generateIDString(responseJSON) {
    const recipeIDs = responseJSON.map(function(item) {
        return item['id'];
    });
    const recipeIdString = recipeIDs.join(',');
	console.log("This is the string of IDs: " + recipeIdString);
	return recipeIdString;
};

function generateIngString(){
	 const ingredientNameArray = STORE.map(function(item) {
   return item['name'];
});
	 const ingredientString = ingredientNameArray.join(',');
	 console.log("This is the ingredient string: " + ingredientString);
	 return ingredientString;
}

function fetchJSON(url) {
  return fetch(url)
	.then(response => {
		if (response.ok) {
			return response.json();
		}
		throw new Error(response.statusText);
	});
}

function fetchRecipes() {
  initiateLoader();
  console.log('fetchRecipes is being called');
	const params = {
		apiKey: apiKey,
		ingredients: generateIngString(),
		ranking: 2,
		ignorePantry: true,
		number: 4
	}
	const queryString = formatQueryParams(params);
	const url = recipeByIngSearchURL + '?' + queryString;
	console.log("This is the url: " + url);

  console.log("This is the JSON from the bottom of fetchRecipes" + fetchJSON(url));
  return fetchJSON(url);
};


function fetchRecipeInfo(responseJSON) {
    console.log('fetchRecipeInfo is being called');
  const combine = infoData => responseJSON.map((r, idx) => ({...r, infoData: infoData[idx]}));

  const params = {
		apiKey: apiKey,
        ids: generateIDString(responseJSON),
	}

	const qStr = formatQueryParams(params);
	const url = bulkRecipeSearchURL + '?' + qStr;
  console.log("This the the bulk url: \n" + url);

  return fetchJSON(url).then(combine);
}


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

const numberOfJsonResponses = 0;

function printJson(responseJSON) {
  numberOfJsonResponses += 1;
  console.log("This is the JSON response #" + numberOfJsonResponses + "\n" + responseJSON);
}

function initiateLoader() {
$('.loader').removeClass('hidden');
};

function hideLoader() {
  $('.loader').addClass('hidden');
};

function pantrySubmitHandler() {
	$('.searchButton').on('click', e => {
		e.preventDefault();
		fetchRecipes().then(
      fetchRecipeInfo
    ).then(
      displayResults
    ).catch(err => {
      alert(`Something went wrong: ${err.message}`);
    });
	})
};

//Modal Functions
function modalHandler() {
  const modal = $('.modal');
  const trigger = $('.modal-trigger');
  const close = $('.modal__close'); // we loops this to catch the different closers

  function closeModal() {
    modal.removeClass('modal--show');
    // Remove hide class after animation is done
    afterAnimation = function() {
      modal.removeClass('modal--hide');
    }
    var modalID = document.getElementById("modal");
    // This listens for the CSS animations to finish and then hides the modal
    modalID.addEventListener("webkitAnimationEnd", afterAnimation, false);
    modalID.addEventListener("oAnimationEnd", afterAnimation, false);
    modalID.addEventListener("msAnimationEnd", afterAnimation, false);
    modalID.addEventListener("animationend", afterAnimation, false);
  }

  // Open the modal
  // function openModalHandler() {
  //   $('#results-list').on('click', '.recipe-result', function(e) {
  //     e.preventDefault();
  //     modal.addClass('modal--show');
  //   });
  // }


  // Close the modal with any element with class 'modal__close'
  for (var i=0; i < close.length; i++) {
    close[i].onclick = function() {
      closeModal();
    }
  }

  // Click outside of the modal and close it
$('.modal').on('click', function (e) {
    if (e.currentTarget !== $('.modal__container')){
      closeModal();
    }

  });

$(window).on('keydown', function (e) {
  if (e.keyCode == 27 && modal.hasClass('modal--show')){
    closeModal();
  }
});

  // Use the escape key to close modal
  document.onkeyup = function(e) {
    e = e || window.event;
    if(modal.hasClass('modal--show')) {
      if(e.keyCode == 27) {
        closeModal();
      }
    }
  }

};

function onLoad() {
	inputHandler();
	deleteIngredientHandler();
	pantrySubmitHandler();
  hideLoader();
  modalHandler();
}

$(onLoad);
