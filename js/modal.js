
/***** Modal management *****/

const dialog = document.getElementById("dialog_modal");
const showButton = document.getElementById("modal_open_btn");
const closeButton = document.getElementById("modal_close_btn");
const closeCross = document.getElementById("modal_close_cross")

// Add an event listener to open the modal on button click
showButton.addEventListener("click", (e) => {
    const movieId = e.target.dataset.id
    displayModal(movieId);
});

// Add an event listener to close the modal on button click
closeButton.addEventListener("click", () => {
    dialog.close();
});
// Add an event listener to close the modal when the close cross is clicked
closeCross.addEventListener("click", () => {
    dialog.close();
});

/***** Displaying movie information in the modal *****/

function displayModal(movieId){
            fetch(`http://localhost:8000/api/v1/titles/`+ movieId)
                .then(res => res.json())
                .then(movieDetails => {
                    // Delete the previous image if it exists to avoid duplicates
                    const existingImg = document.getElementById("modal_img");
                    if (existingImg) {
                        existingImg.remove();
                    }

                    // Creates a new image element for the movie
                    const modalImg = document.createElement("img");
                    modalImg.className = "modal_img";
                    modalImg.src = movieDetails.image_url;
                    modalImg.alt = "Affiche du film " + movieDetails.title;
                    modalImg.id = "modal_img";
        
                    // Insert the image into the DOM, after the movie details
                    const modalInfo = document.querySelector(".modal_detail_film");
                    modalInfo.insertAdjacentElement("afterend", modalImg);

                    // Updates movie details in modal
                    document.getElementById("modal_detail_title").textContent = movieDetails.title;
                    document.getElementById("long_description").textContent = movieDetails.long_description;
                    document.getElementById("modal_detail_date").textContent = movieDetails.year + " - ";
                    document.getElementById("modal_detail_genre").textContent = movieDetails.genres;
                    document.getElementById("modal_detail_duration").textContent =  movieDetails.duration + " minutes";
                    document.getElementById("modal_detail_country").textContent = "(" + movieDetails.countries + ")";
                    document.getElementById("modal_detail_IMDB").textContent = "IMDB score : " + movieDetails.imdb_score;
                    document.getElementById("modal_detail_director").textContent = movieDetails.directors;
                    document.getElementById("modal_actor_list").textContent = movieDetails.actors;

                    // Updates the film rating, if available
                    const ratedElement = document.getElementById("modal_detail_classification");
                    if (movieDetails.rated === "Not rated or unkown rating") {
                        ratedElement.textContent = " ";
                    } else {
                        ratedElement.textContent = "PEG - " + movieDetails.rated +" -"; 
                    }
                    // Shows the modal with movie details
                    dialog.showModal();
                })
            .catch(err => console.log(err));
}