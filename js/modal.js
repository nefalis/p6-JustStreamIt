
/***** Gestion de la modal *****/
const dialog = document.getElementById("dialog_modal");
const showButton = document.getElementById("modal_open_btn");
const closeButton = document.getElementById("modal_close_btn");
const closeCross = document.getElementById("modal_close_cross")

// Le bouton "Afficher la fenêtre" ouvre le dialogue
showButton.addEventListener("click", (e) => {
    const movieId = e.target.dataset.id
    displayModal(movieId);
    
});

// Le bouton "Fermer" ferme le dialogue
closeButton.addEventListener("click", () => {
    dialog.close();
});

closeCross.addEventListener("click", () => {
    dialog.close();
});

/***** Information sur le film *****/
function displayModal(movieId){
            fetch(`http://localhost:8000/api/v1/titles/`+ movieId)
                .then(res => res.json())
                .then(movieDetails => {
                    // Supprimer l'image précédente si elle existe
                    const existingImg = document.getElementById("modal_img");
                    if (existingImg) {
                        existingImg.remove();
                    }

                    // element image
                    const modalImg = document.createElement("img");
                    modalImg.className = "modal_img";
                    modalImg.src = movieDetails.image_url;
                    modalImg.alt = "Affiche du film " + movieDetails.title;
                    modalImg.id = "modal_img";
        
                    // Insertion de l'image dans le DOM
                    const modalInfo = document.querySelector(".modal_detail_film");
                    modalInfo.insertAdjacentElement("afterend", modalImg);

                    document.getElementById("modal_detail_title").textContent = movieDetails.title;
                    document.getElementById("long_description").textContent = movieDetails.long_description;
                    document.getElementById("modal_detail_date").textContent = movieDetails.year + " - ";
                    document.getElementById("modal_detail_genre").textContent = movieDetails.genres;
                    document.getElementById("modal_detail_duration").textContent =  movieDetails.duration + " minutes";
                    document.getElementById("modal_detail_country").textContent = "(" + movieDetails.countries + ")";
                    document.getElementById("modal_detail_IMDB").textContent = "IMDB score : " + movieDetails.imdb_score;
                    document.getElementById("modal_detail_director").textContent = movieDetails.directors;
                    document.getElementById("modal_actor_list").textContent = movieDetails.actors;

                    const ratedElement = document.getElementById("modal_detail_classification");
                    if (movieDetails.rated === "Not rated or unkown rating") {
                        ratedElement.textContent = " ";
                    } else {
                        ratedElement.textContent = "PEG - " + movieDetails.rated +" -"; 
                    }
                    
                    dialog.showModal();
                })


            .catch(err => console.log(err));
}

