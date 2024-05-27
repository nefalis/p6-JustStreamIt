// Appel pour afficher le meilleur film
displayBestMovie();

// Fonction d'initialisation des catégories avec gestion des erreurs
const init = async () => {
    try {
        await fetchDataCategory("", "Films les mieux notés");
        await fetchDataCategory("Sci-Fi", "Sci-Fi");
        await fetchDataCategory("Action", "Action");
    } catch (err) {
        console.error(err);
    }
};

/***** Information meilleur film *****/

function displayBestMovie() {
    // Requête pour obtenir le film le mieux noté
    fetch('http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page_size=1&page=1')
        .then(res => res.json())
        .then(data => {
            // Requête pour obtenir les détails du film
            fetch(`http://localhost:8000/api/v1/titles/`+ data.results[0].id)
                .then(res => res.json())
                .then(movieDetails => {
                    // Création et insertion de l'image du meilleur film
                    const bestFilmImg = document.createElement("img");
                    bestFilmImg.className = "best_film_img";
                    bestFilmImg.src = movieDetails.image_url;
                    bestFilmImg.alt = "Affiche du film " + movieDetails.title;
                    bestFilmImg.id = "best_film_img";
                    const bestFilmContainer = document.querySelector(".best_film_container");
                    bestFilmContainer.insertAdjacentElement("afterbegin", bestFilmImg);
                    // Mise à jour des informations du meilleur film
                    document.getElementById("best_film_title").innerText = movieDetails.title;
                    document.getElementById("best_film_description").innerText = movieDetails.description;
                    document.getElementById("modal_open_btn").dataset.id = movieDetails.id
                })
            .catch(err => console.log(err));
            })
        .catch(err => console.log(err));
}

/***** Récupération des films par catégorie *****/

function fetchDataCategory(catUrl) {
    let apiUrl = catUrl !== "" ? `genre=${catUrl}` : "";
    return fetch(`http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&${apiUrl}&page_size=6`)
        .then(res => res.json())
}

// Initialisation des catégories avec gestion asynchrone
const initCategories = () => {
    Promise.all([
        fetchDataCategory(""),
        fetchDataCategory("Sci-Fi"),
        fetchDataCategory("Action")
    ])
    .then(data => {
        displayCategory(data[0].results, "Films les mieux notés");
        displayCategory(data[1].results, "Sci-Fi");
        displayCategory(data[2].results, "Action");
    })
    .catch(err => {
        console.log(err)
    });
}

initCategories();

// Création d'un élément de film pour une catégorie
function createFilmElement(film) {
    const catFilm = document.createElement("div");
    catFilm.classList.add("category_film");

    const catImg = document.createElement("img");
    catImg.classList.add("category_film_img");
    catImg.src = film.image_url;
    catImg.alt = "Affiche du film " + film.title;

    const catContent = document.createElement("div");
    catContent.classList.add("category_film_content");

    const catSubTitle = document.createElement("h3");
    catSubTitle.classList.add("category_film_title");
    catSubTitle.innerText = film.title;

    const catBtn = document.createElement("button");
    catBtn.classList.add("category_film_button");
    catBtn.id = `catBtnId-${film.id}`;
    catBtn.dataset.id = film.id;
    catBtn.textContent = "Détails";

    catContent.appendChild(catSubTitle);
    catContent.appendChild(catBtn);

    catFilm.appendChild(catImg);
    catFilm.appendChild(catContent);

    // Ajout d'un écouteur d'événement pour ouvrir le modal des détails du film
    catBtn.addEventListener("click", (e) => {
        const movieId = e.target.dataset.id;
        displayModal(movieId);
    });
    return catFilm;
}

// Création d'un bouton de basculement pour afficher plus ou moins de films
function createToggleBtn(container) {
    const toggleBtn = document.createElement("button");
    toggleBtn.classList.add("toggle_button");
    toggleBtn.textContent = "Voir plus";

    toggleBtn.addEventListener("click", () => {
        container.classList.toggle("expanded");
        toggleBtn.textContent = container.classList.contains("expanded") ? "Voir moins" : "Voir plus";
    });
    return toggleBtn;
}

// Affichage des films par catégorie
function displayCategory(catResult, catText) {
    const catCategory = document.querySelector(".category");

    const catSection = document.createElement("section");
    catSection.classList.add("category_film_section");

    const catTitle = document.createElement("h2");
    catTitle.classList.add("category_title_section");
    catTitle.textContent = catText;

    const catContainer = document.createElement("div");
    catContainer.classList.add("category_film_container");

    catSection.appendChild(catTitle);
    catSection.appendChild(catContainer);
    catCategory.appendChild(catSection);
    // Ajout des films dans la catégorie
    catResult.forEach(film => {
        const filmElement = createFilmElement(film);
        catContainer.appendChild(filmElement);
    });

    const toggleBtn = createToggleBtn(catContainer);
    catSection.appendChild(toggleBtn);
}

/***** Affichage des films par genre avec dropdown *****/

function filmByGenre(genreName) {
    fetch(`http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=${genreName}&page_size=6`)
    .then(res => res.json())
    .then(data => {
        const films = data.results;
        const filmContainer = document.querySelector('.category_film_list');

        // Vérification que le conteneur parent est défini
        const parentContainer = filmContainer ? filmContainer.parentElement : null;

        if (parentContainer) {
            // Suppression des boutons de basculement existants
            const existingToggleBtn = parentContainer.querySelector(".toggle_button");
                if (existingToggleBtn) {
                    existingToggleBtn.remove();
                }
            }

            // Effacement du contenu existant dans le conteneur de films
            if (filmContainer) {
                filmContainer.innerHTML = '';
            }

        // Ajout des films au conteneur
        films.forEach(film => {
            const filmElement = createFilmElement(film);
            filmContainer.appendChild(filmElement);
        });

        const toggleBtn = createToggleBtn(filmContainer);
        filmContainer.parentElement.appendChild(toggleBtn);
    })
    .catch(err => console.error(err));   
}

/***** Gestion du menu dropdown *****/

// Fermer le menu dropdown
function closeMenu() {
    dropdownMenu.classList.remove('open');
}

// Sélection des éléments du menu dropdown
const dropdownBtn = document.querySelector('.dropdown_btn');
const dropdownMenu = document.querySelector('.dropdown_menu');
const selectedItem = document.getElementById('selected_item');

// Ouvrir ou fermer le menu dropdown
dropdownBtn.addEventListener('click', toggleMenu);

// Gestion des clics dans le menu dropdown
dropdownMenu.addEventListener('click', function(event) {
    if (event.target.classList.contains('dropdown_item')) {
         // Suppression de l'icône des éléments précédemment sélectionnés
        const previouslySelected = document.querySelector('.dropdown_item.selected');
        if (previouslySelected) {
            previouslySelected.classList.remove('selected');
            const icon = previouslySelected.querySelector('.selected-item-icon');
            if (icon) {
                icon.remove();
            }
        }

        // Ajout de l'icône à l'élément actuellement sélectionné
        const selectedGenre = event.target.innerText;
        event.target.classList.add('selected');
        event.target.innerHTML = selectedGenre + ' <i class="fa fa-check-square selected-item-icon"></i>';
        
        // Mise à jour du texte du bouton dropdown
        selectedItem.innerText = selectedGenre;

        // Chargement des films par genre
        filmByGenre(selectedGenre);
        
        // Fermer le menu
        closeMenu();
    }
});

// Bascule du menu dropdown
function toggleMenu() {
    dropdownMenu.classList.toggle('open');
}

// Récupération des éléments du dropdown et remplissage du menu
function fetchDropdownItems() {
    fetch(`http://localhost:8000/api/v1/genres/?page_size=25`)
        .then(res => res.json())
        .then(data => {
            const genres = data.results;

            // Effacement des éléments du dropdown existants
            dropdownMenu.innerHTML = '';

            // Création et ajout des éléments au dropdown
            genres.forEach(genre => {
                const listGenre = document.createElement('div');
                listGenre.classList.add("dropdown_item");
                listGenre.textContent = genre.name;

                dropdownMenu.appendChild(listGenre);
            });

            // Événement de clic pour sélectionner un genre
            dropdownMenu.removeEventListener('click', function(event) {
                if (event.target.classList.contains('dropdown_item')) {
                    selectedItem.innerText = event.target.innerText;
                    closeMenu();
                }
            });
        })
        .catch(err => console.log(err));
}

fetchDropdownItems();