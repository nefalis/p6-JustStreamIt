displayBestMovie();
initCategory();


function initCategory(){
    fetchDataCategory("", "Films les mieux notés");
    fetchDataCategory("Sci-Fi", "Sci-Fi");
    fetchDataCategory("Action", "Action");   
}

/***** Information meilleur film *****/
function displayBestMovie() {
    fetch('http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page_size=1&page=1')
        .then(res => res.json())
        .then(data => {

            fetch(`http://localhost:8000/api/v1/titles/`+ data.results[0].id)
                .then(res => res.json())
                .then(movieDetails => {
                    // element image
                    const best_film_img = document.getElementById("best_film_img");
                    best_film_img.src = movieDetails.image_url;
                    best_film_img.alt = movieDetails.title;

                    document.getElementById("best_film_title").innerText = movieDetails.title;
                    document.getElementById("best_film_description").innerText = movieDetails.description;
                    document.getElementById("modal_open_btn").dataset.id = movieDetails.id
                })
            .catch(err => console.log(err));
            })
        .catch(err => console.log(err));
}

/***** film par catégorie *****/
function fetchDataCategory(catUrl, catText){
    let apiUrl;
    if (catUrl !== "") {
        apiUrl = `genre=${catUrl}`;
    } else {
        apiUrl = "";
    }

    fetch(`http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&${apiUrl}&page_size=6`) 
        .then(res => res.json())
        .then(movies => {
            displayCategory(movies.results, catText)
        })
        .catch(err => console.log(err));
}

function displayCategory(catResult, catText){
    const catCategory = document.querySelector(".category")

    const catTitle = document.createElement("h2")
    catTitle.classList.add("category_title_section");
    catTitle.textContent = catText;

    const catContainer = document.createElement("div");
    catContainer.classList.add("category_film_container");

    catCategory.appendChild(catTitle);
    catCategory.appendChild(catContainer);

    catResult.forEach(film => {

        const catFilm = document.createElement("div");
        catFilm.classList.add("category_film");

        const catImg = document.createElement("img");
        catImg.classList.add("category_film_img")
        catImg.src = film.image_url;
        catImg.alt = film.title;

        const catContent = document.createElement("div");
        catContent.classList.add("category_film_content");

        const catSubTitle = document.createElement("h3");
        catSubTitle.classList.add("category_film_title");
        catSubTitle.innerText = film.title;

        const catBtn = document.createElement("button");
        catBtn.classList.add("category_film_button");
        catBtn.id = `catBtnId-${film.id}`
        catBtn.dataset.id = film.id
        catBtn.textContent = "Détails"

        catContent.appendChild(catSubTitle);
        catContent.appendChild(catBtn);

        catFilm.appendChild(catImg);
        catFilm.appendChild(catContent);

        catContainer.appendChild(catFilm);

        catBtn.addEventListener("click", (e) => {
            const movieId = e.target.dataset.id
            displayModal(movieId);
        })

     } )
}

/***** Film avec dropdown *****/

function filmByGenre(genreName) {
    fetch(`http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=${genreName}&page_size=6`)
    .then(res => res.json())
    .then(data => {
        const films = data.results;
        const filmContainer = document.querySelector('.category_film_list');
        filmContainer.innerHTML = '';
        films.forEach(film => {
            const filmElement = document.createElement('div');
            filmElement.classList.add('category_film');
            filmElement.innerHTML = `
                <img class="category_film_img" src="${film.image_url}" alt="${film.title}">
                <div class="category_film_content">
                    <h3 class="category_film_title">${film.title}</h3>
                    <button class="category_film_button" id="open_modal_btn" data-id="${film.id}">Détails</button>
                </div>
            `;
            filmContainer.appendChild(filmElement);

            const detailButton = filmElement.querySelector('.category_film_button');
            detailButton.addEventListener("click", (e) => {
                const movieId = e.currentTarget.dataset.id;
                displayModal(movieId);
            });
        });

    })
    .catch(err => console.error(err));
}

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
        const selectedGenre = event.target.innerText;
        selectedItem.innerText = selectedGenre;
        filmByGenre(selectedGenre);
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