
/***** Information meilleur film *****/
fetch('http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page_size=10&page=1')
    .then(res => res.json())
    .then(data => {
        const movie = data.results[0];
        const movieId = movie.id;
        console.log(movieId);
        
        fetch(`http://localhost:8000/api/v1/titles/`+ movieId)
            .then(res => res.json())
            .then(movieDetails => {
                console.log("pouet");
                // element image
                const best_film_img = document.getElementById("image_url");
                best_film_img.src = movieDetails.image_url;
                best_film_img.alt = movieDetails.title;
                // element titre
                const best_film_title = document.getElementById("title");
                console.log(best_film_title);
                best_film_title.textContent = movieDetails.title;
                // element description
                const best_film_description = document.getElementById("description");
                console.log(best_film_description);
                best_film_description.innerText = movieDetails.description;
            })
        .catch(err => console.log(err));
        })
    .catch(err => console.log(err));

/***** Information catégorie Animation *****/
//http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=Animation

/***** Information catégorie Sci-Fi 15 "name": "Sci-Fi" *****/
//http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=Sci-Fi

/***** Information catégorie Action 14  *****/
// http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=Action

// /****** Adapté le nombre de film a la taille de l'ecran *****/
// function getNumberOfFilms() {
//     const screenWidth = window.innerWidth;
//     let numberOfFilms;

//     // Définir le nombre de films en fonction de la taille de l'écran
//     if (screenWidth >= 1054) {
//         numberOfFilms = 6;
//     } else if (screenWidth >= 788) {
//         numberOfFilms = 4; 
//     } else {
//         numberOfFilms = 2; 
//     }
//     return numberOfFilms;
// }



