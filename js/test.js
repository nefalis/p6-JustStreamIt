
// item de la liste
const dropdownList = document.getElementById('dropdown_menu');
function fetchDropdownItem() {
    fetch(`http://localhost:8000/api/v1/genres/`)
        .then(res => res.json())
        .then(data => {
            const genres = data.results
            console.log(genres);

            genres.forEach(genre => {
                const listGenre = document.createElement('div');
                listGenre.classList.add("dropdown_item");
                listGenre.textContent = genre.name;

                dropdownList.appendChild(listGenre);

            })

        })
        .catch(err => console.log(err));
}

// dropdown menu
const dropdownBtn = document.querySelector('.dropdown_btn')
const dropdownMenu = document.querySelector('.dropdown_menu')
const items = document.querySelectorAll('.dropdown_item')
const selectedItem = document.getElementById('selected_item')

// add global event listener for outside clik
window.addEventListener('click', function () {
    closeMenu
})

// dropdown open
dropdownBtn.addEventListener('click', toggleMenu)

// add click event listener to each item
items.forEach(item => item.addEventListener('click', itemClickHandler))

// toggle menu
function toggleMenu() {
    dropdownMenu.classList.toggle('open')
}

// close menu
function closeMenu() {
    dropdownMenu.classList.remove('open')
}

// item click handler
function itemClickHandler(e) {
    selectedItem.innerText = e.target.innerText
    // change active class
    items.forEach(item => item.classList.remove('active'))
    // add active class to click item
    e.target.classList.add('active')
    closeMenu()
}
