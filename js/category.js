displayBestMovie();
initCategory();

function initCategory(){
    fetchDataCategory("Animation");
    fetchDataCategory("Sci-Fi");
    fetchDataCategory("Action");   
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
                    // element titre
                    const best_film_title = document.getElementById("best_film_title");
                    best_film_title.innerText = movieDetails.title;
                    // element description
                    const best_film_description = document.getElementById("best_film_description");
                    best_film_description.innerText = movieDetails.description;

                    const btnDetail = document.getElementById("modal_open_btn")
                    btnDetail.dataset.id = movieDetails.id
                })
            .catch(err => console.log(err));
            })
        .catch(err => console.log(err));
}

function fetchDataCategory(catUrl){
    fetch(`http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=${catUrl}&page_size=6`) 
        .then(res => res.json())
        .then(movies => {
            displayCategory(movies.results, catUrl)
        })
        .catch(err => console.log(err));
}

function displayCategory(catResult, catText){
    const catCategory = document.querySelector(".category")

    const catTitle = document.createElement("h2");
    catTitle.classList.add("category_title_section");
    catTitle.textContent = catText;

    const catContainer = document.createElement("div");
    catContainer.classList.add("category_film_container");

    catCategory.appendChild(catTitle);
    catCategory.appendChild(catContainer);
    console.log(catResult.length);

    catResult.forEach((film, index) => {

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