
/***** Gestion de la modal *****/
const dialog = document.getElementById("dialog_modal");
const showButton = document.getElementById("modal_open_btn");
const closeButton = document.getElementById("modal_close_btn");

// Le bouton "Afficher la fenêtre" ouvre le dialogue
showButton.addEventListener("click", () => {
    console.log("pouet");
    dialog.showModal();
});
  
// Le bouton "Fermer" ferme le dialogue
closeButton.addEventListener("click", () => {
    dialog.close();
});

/***** Information sur le film *****/
fetch('http://localhost:8000/api/v1/titles/')
    .then(res => res.json())
    .then(movie => {
        const movieId = movie.id;

        fetch(`http://localhost:8000/api/v1/titles/`+ movieId)
            .then(res => res.json())
            .then(movieDetails => {
                console.log(movieDetails);
                // element image
                const modal_img = document.getElementById("image_url");
                modal_img.src = movieDetails.image_url;
                modal_img.alt = movieDetails.title;
                // element titre
                const modal_detail_title = document.getElementById("title");
                modal_detail_title.textContent = movieDetails.title;
                // element description
                const modal_description_film = document.getElementById("long_description");
                modal_description_film.textContent = movieDetails.long_description;
                // element année
                const modal_detail_date = document.getElementById("year");
                modal_detail_date.textContent = movieDetails.year;
                // element genre
                const modal_detail_genre = document.getElementById("genres");
                modal_detail_genre.textContent = movieDetails.genres;
                // element durée du film
                const modal_detail_during = document.getElementById("duration");
                modal_detail_during.textContent = movieDetails.duration;
                //element pays
                const modal_detail_country = document.getElementById("countries");
                modal_detail_country.textContent = movieDetails.countries;
                // element IMDB
                const modal_detail_IMDB = document.getElementById("imdb_score");
                modal_detail_IMDB.textContent = movieDetails.imdb_score;
                // element director
                const modal_detail_director = document.getElementById("directors");
                modal_detail_director.textContent = movieDetails.directors;
                // element acteur
                const modal_actor = document.getElementById("actors");
                modal_actor.textContent = movieDetails.actors;

                // element classification ????
                const modal_detail_classification = document.getElementById("classification");
                modal_detail_classification.textContent = movieDetails.classification;

            })
        .catch(err => console.log(err));
        })
    .catch(err => console.log(err));