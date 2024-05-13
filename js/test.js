
function displayCategory(catResult, catText){
    const catCategory = document.querySelector(".category")

    const catTitle = document.createElement("h2")
    catTitle.classList.add("category_title_section");
    catTitle.textContent = catText;

    const catContainer = document.createElement("div");
    catContainer.classList.add("category_film_container");

    catCategory.appendChild(catTitle);
    catCategory.appendChild(catContainer);

    catResult.forEach((film, index) => {

        // const catFilm = document.createElement("div");
        // catFilm.classList.add("category_film");

        // const catImg = document.createElement("img");
        // catImg.classList.add("category_film_img")
        // catImg.src = film.image_url;
        // catImg.alt = film.title;

        // const catContent = document.createElement("div");
        // catContent.classList.add("category_film_content");

        // const catSubTitle = document.createElement("h3");
        // catSubTitle.classList.add("category_film_title");
        // catSubTitle.innerText = film.title;

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


<i class="fa-thin fa-square-check"></i>