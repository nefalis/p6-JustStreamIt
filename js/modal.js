
/***** Gestion de la modal *****/
const dialog = document.getElementById("dialog_modal");
const showButton = document.getElementById("modal_open_btn");
const closeButton = document.getElementById("modal_close_btn");

// Le bouton "Afficher la fenêtre" ouvre le dialogue
showButton.addEventListener("click", (e) => {
    const movieId = e.target.dataset.id
    console.log(movieId);
    displayModal(movieId);
    
});

// Le bouton "Fermer" ferme le dialogue
closeButton.addEventListener("click", () => {
    dialog.close();
});

/***** Information sur le film *****/
function displayModal(movieId){
    console.log("prout");
            fetch(`http://localhost:8000/api/v1/titles/`+ movieId)
                .then(res => res.json())
                .then(movieDetails => {

                    // element image
                    const modal_img = document.getElementById("modal_img");
                    modal_img.src = movieDetails.image_url;
                    modal_img.alt = movieDetails.title;
                    // element titre
                    const modal_detail_title = document.getElementById("modal_detail_title");
                    modal_detail_title.textContent = movieDetails.title;
                    // element description
                    const modal_description_film = document.getElementById("long_description");
                    modal_description_film.textContent = movieDetails.long_description;
                    // element année
                    const modal_detail_date = document.getElementById("modal_detail_date");
                    modal_detail_date.textContent = movieDetails.year + " - ";
                    // element genre
                    const modal_detail_genre = document.getElementById("modal_detail_genre");
                    modal_detail_genre.textContent = movieDetails.genres;
                    // element durée du film
                    const modal_detail_during = document.getElementById("modal_detail_duration");
                    modal_detail_during.textContent = movieDetails.duration + " minutes";
                    //element pays
                    const modal_detail_country = document.getElementById("modal_detail_country");
                    modal_detail_country.textContent = movieDetails.countries;
                    // element IMDB
                    const modal_detail_IMDB = document.getElementById("modal_detail_IMDB");
                    modal_detail_IMDB.textContent = "IMDB score : " + movieDetails.imdb_score;
                    // element director
                    const modal_detail_director = document.getElementById("modal_detail_director");
                    modal_detail_director.textContent = movieDetails.directors;
                    // element acteur
                    const modal_actor = document.getElementById("modal_actor_list");
                    modal_actor.textContent = movieDetails.actors;

                    // element classification ????
                    const modal_detail_classification = document.getElementById("modal_detail_classification");
                    modal_detail_classification.textContent = movieDetails.classification;

                    dialog.showModal();
                })


            .catch(err => console.log(err));
}