

fetch("https://edamam-recipe-search.p.rapidapi.com/search?q=chicken", {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "edamam-recipe-search.p.rapidapi.com",
		"x-rapidapi-key": "233f3f3c3amshcd0f9bc8347421dp101e1ejsnae13d51c879b"
	}
})
.then(response => {
	console.log(response);
})
.catch(err => {
	console.log(err);
});
