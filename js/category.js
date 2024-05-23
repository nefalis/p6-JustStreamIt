
displayBestMovie();

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
    fetch('http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page_size=1&page=1')
        .then(res => res.json())
        .then(data => {

            fetch(`http://localhost:8000/api/v1/titles/`+ data.results[0].id)
                .then(res => res.json())
                .then(movieDetails => {
                    // element image
                    const bestFilmImg = document.createElement("img");
                    bestFilmImg.className = "best_film_img";
                    bestFilmImg.src = movieDetails.image_url;
                    bestFilmImg.alt = movieDetails.title;
                    bestFilmImg.id = "best_film_img";
                    const bestFilmContainer = document.querySelector(".best_film_container");
                    bestFilmContainer.insertAdjacentElement("afterbegin", bestFilmImg);

                    document.getElementById("best_film_title").innerText = movieDetails.title;
                    document.getElementById("best_film_description").innerText = movieDetails.description;
                    document.getElementById("modal_open_btn").dataset.id = movieDetails.id
                })
            .catch(err => console.log(err));
            })
        .catch(err => console.log(err));
}

/***** film par catégorie *****/

function fetchDataCategory(catUrl) {
    let apiUrl = catUrl !== "" ? `genre=${catUrl}` : "";

    return fetch(`http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&${apiUrl}&page_size=6`)
        .then(res => res.json())
}

// Fonction pour initialiser les catégories avec Promise.all
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

function createFilmElement(film) {
    const catFilm = document.createElement("div");
    catFilm.classList.add("category_film");

    const catImg = document.createElement("img");
    catImg.classList.add("category_film_img");
    catImg.src = film.image_url;
    catImg.alt = film.title;

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

    catBtn.addEventListener("click", (e) => {
        const movieId = e.target.dataset.id;
        displayModal(movieId);
    });

    return catFilm;
}

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

function displayCategory(catResult, catText) {
    const catCategory = document.querySelector(".category");

    const catTitle = document.createElement("h2");
    catTitle.classList.add("category_title_section");
    catTitle.textContent = catText;

    const catContainer = document.createElement("div");
    catContainer.classList.add("category_film_container");

    catCategory.appendChild(catTitle);
    catCategory.appendChild(catContainer);

    catResult.forEach(film => {
        const filmElement = createFilmElement(film);
        catContainer.appendChild(filmElement);
    });

    const toggleBtn = createToggleBtn(catContainer);
    catCategory.appendChild(toggleBtn);
}

/***** Film avec dropdown *****/

function filmByGenre(genreName) {
    fetch(`http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=${genreName}&page_size=6`)
    .then(res => res.json())
    .then(data => {
        const films = data.results;
        const filmContainer = document.querySelector('.category_film_list');

        // Ensure parent container is defined
        const parentContainer = filmContainer ? filmContainer.parentElement : null;

        if (parentContainer) {
            // Remove any existing toggle buttons before adding a new one
            const existingToggleBtn = parentContainer.querySelector(".toggle_button");
                if (existingToggleBtn) {
                    existingToggleBtn.remove();
                }
            }

            // Clear existing content in the film container
            if (filmContainer) {
                filmContainer.innerHTML = '';
            }

        films.forEach(film => {
            const filmElement = createFilmElement(film);
            filmContainer.appendChild(filmElement);
        });

        const toggleBtn = createToggleBtn(filmContainer);
        filmContainer.parentElement.appendChild(toggleBtn);
    })
    .catch(err => console.error(err));   
}


/***** dropdown *****/

// fermer le menu
function closeMenu() {
    dropdownMenu.classList.remove('open');
}

// menu dropdown
const dropdownBtn = document.querySelector('.dropdown_btn');
const dropdownMenu = document.querySelector('.dropdown_menu');
const selectedItem = document.getElementById('selected_item');

// fermer le menu si on clique ailleurs
window.addEventListener('click', function () {
    closeMenu
})

// ouvrir le menu
dropdownBtn.addEventListener('click', toggleMenu);

// Evenement au clique
dropdownMenu.addEventListener('click', function(event) {
    if (event.target.classList.contains('dropdown_item')) {
        // Supprimer l'icône des éléments précédemment sélectionnés
        const previouslySelected = document.querySelector('.dropdown_item.selected');
        if (previouslySelected) {
            previouslySelected.classList.remove('selected');
            const icon = previouslySelected.querySelector('.selected-item-icon');
            if (icon) {
                icon.remove();
            }
        }

        // Ajouter l'icône à l'élément actuellement sélectionné
        const selectedGenre = event.target.innerText;
        event.target.classList.add('selected');
        event.target.innerHTML = selectedGenre + ' <i class="fa fa-check-square selected-item-icon"></i>';
        
        // Mettre à jour le texte du bouton dropdown
        selectedItem.innerText = selectedGenre;

        // Charger les films par genre
        filmByGenre(selectedGenre);
        
        // Fermer le menu
        closeMenu();
    }
});

// toggle menu
function toggleMenu() {
    dropdownMenu.classList.toggle('open');
}

// fonction pour récupérér et remplir les éléments
function fetchDropdownItems() {
    fetch(`http://localhost:8000/api/v1/genres/?page_size=25`)
        .then(res => res.json())
        .then(data => {
            const genres = data.results;

            // Effacer les éléments du dropdown existants
            dropdownMenu.innerHTML = '';

            // Créer et ajouter des éléments au dropdown
            genres.forEach(genre => {
                const listGenre = document.createElement('div');
                listGenre.classList.add("dropdown_item");
                listGenre.textContent = genre.name;

                dropdownMenu.appendChild(listGenre);
            });

            // evenement click 
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