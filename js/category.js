// Call to show the best film
displayBestMovie();

// Category initialization function with error handling
const init = async () => {
    try {
        await fetchDataCategory("", "Films les mieux notés");
        await fetchDataCategory("Sci-Fi", "Sci-Fi");
        await fetchDataCategory("Action", "Action");
    } catch (err) {
        console.error(err);
    }
};

/***** Information best film *****/

function displayBestMovie() {
    // Query to get top rated movie
    fetch('http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page_size=1&page=1')
        .then(res => res.json())
        .then(data => {
            // Query to get movie details
            fetch(`http://localhost:8000/api/v1/titles/`+ data.results[0].id)
                .then(res => res.json())
                .then(movieDetails => {
                    // Creation and insertion of the image of the best film
                    const bestFilmImg = document.createElement("img");
                    bestFilmImg.className = "best_film_img";
                    bestFilmImg.src = movieDetails.image_url;
                    bestFilmImg.alt = "Affiche du film " + movieDetails.title;
                    bestFilmImg.id = "best_film_img";
                    const bestFilmContainer = document.querySelector(".best_film_container");
                    bestFilmContainer.insertAdjacentElement("afterbegin", bestFilmImg);
                    // Best Picture Information Update
                    document.getElementById("best_film_title").innerText = movieDetails.title;
                    document.getElementById("best_film_description").innerText = movieDetails.description;
                    document.getElementById("modal_open_btn").dataset.id = movieDetails.id
                })
            .catch(err => console.log(err));
            })
        .catch(err => console.log(err));
}

/***** Recovery of films by category *****/

function fetchDataCategory(catUrl) {
    let apiUrl = catUrl !== "" ? `genre=${catUrl}` : "";
    return fetch(`http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&${apiUrl}&page_size=6`)
        .then(res => res.json())
}

// Initialization of categories with asynchronous management
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

// Creating a movie item for a category
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

    // Added event listener to open movie details modal
    catBtn.addEventListener("click", (e) => {
        const movieId = e.target.dataset.id;
        displayModal(movieId);
    });
    return catFilm;
}

// Creating a toggle button to show more or fewer movies
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

// Viewing movies by category
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
    // Adding films to the category
    catResult.forEach(film => {
        const filmElement = createFilmElement(film);
        catContainer.appendChild(filmElement);
    });

    const toggleBtn = createToggleBtn(catContainer);
    catSection.appendChild(toggleBtn);
}

/***** Displaying films by genre with dropdown *****/

function filmByGenre(genreName) {
    fetch(`http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=${genreName}&page_size=6`)
    .then(res => res.json())
    .then(data => {
        const films = data.results;
        const filmContainer = document.querySelector('.category_film_list');

        // Verifying that the parent container is defined
        const parentContainer = filmContainer ? filmContainer.parentElement : null;

        if (parentContainer) {
            // Removing existing toggle buttons
            const existingToggleBtn = parentContainer.querySelector(".toggle_button");
                if (existingToggleBtn) {
                    existingToggleBtn.remove();
                }
            }

            // Clearing existing content in the movie container
            if (filmContainer) {
                filmContainer.innerHTML = '';
            }

        // Adding films to the container
        films.forEach(film => {
            const filmElement = createFilmElement(film);
            filmContainer.appendChild(filmElement);
        });

        const toggleBtn = createToggleBtn(filmContainer);
        filmContainer.parentElement.appendChild(toggleBtn);
    })
    .catch(err => console.error(err));   
}

/***** Dropdown menu management *****/

// Close dropdown menu
function closeMenu() {
    dropdownMenu.classList.remove('open');
}

// Selecting dropdown menu items
const dropdownBtn = document.querySelector('.dropdown_btn');
const dropdownMenu = document.querySelector('.dropdown_menu');
const selectedItem = document.getElementById('selected_item');

// Open or close the dropdown menu
dropdownBtn.addEventListener('click', toggleMenu);

// Managing clicks in the dropdown menu
dropdownMenu.addEventListener('click', function(event) {
    if (event.target.classList.contains('dropdown_item')) {
         // Removing the icon from previously selected items
        const previouslySelected = document.querySelector('.dropdown_item.selected');
        if (previouslySelected) {
            previouslySelected.classList.remove('selected');
            const icon = previouslySelected.querySelector('.selected-item-icon');
            if (icon) {
                icon.remove();
            }
        }

        // Adding the icon to the currently selected item
        const selectedGenre = event.target.innerText;
        event.target.classList.add('selected');
        event.target.innerHTML = selectedGenre + ' <i class="fa fa-check-square selected-item-icon"></i>';
        
        // Updating dropdown button text
        selectedItem.innerText = selectedGenre;

        // Loading movies by genre
        filmByGenre(selectedGenre);
        
        // Close menu
        closeMenu();
    }
});

// Dropdown menu toggle
function toggleMenu() {
    dropdownMenu.classList.toggle('open');
}

// Retrieving dropdown items and filling the menu
function fetchDropdownItems() {
    fetch(`http://localhost:8000/api/v1/genres/?page_size=25`)
        .then(res => res.json())
        .then(data => {
            const genres = data.results;

            // Clearing existing dropdown items
            dropdownMenu.innerHTML = '';

            // Creating and adding elements to the dropdown
            genres.forEach(genre => {
                const listGenre = document.createElement('div');
                listGenre.classList.add("dropdown_item");
                listGenre.textContent = genre.name;

                dropdownMenu.appendChild(listGenre);
            });

            // Click event to select genre
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