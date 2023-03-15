const container = document.getElementById('upcoming-container');
const search = document.getElementById('search-box');
const categorySearch = document.getElementById('categories');

const dataIndex = data.events;
let dateFilter = eventsFilter(dataIndex);

//Functions calls
showCheckboxs(dataIndex);
showCards(dateFilter);

//Functions
function showCheckboxs(array) {
    let categoryArr = Array.from(new Set(array.map(dataIndex => dataIndex.category)));

    categoryArr.forEach(category => {
        categorySearch.innerHTML += `
        <li>
            <input type="checkbox" id="${category}" class="checkbox" value="${category}">
            <label for="${category}">${category}</label>
        </li>`;
    });
};

function showCards(array) {

    if (array.length == 0) {
        container.innerHTML = `<h2 id="no-content" class="no-content">There's not event whit that name...</h2>`
        return
    }

    let cards = '';
    array.forEach((event) => {
        cards += `
            <div class="card">
                <img src="${event.image}" class="card-img" alt="Cinema">
                <div class="card-body">
                    <div class="title-container">
                        <h5 class="card-title">${event.category}</h5>
                        <p class="colorText">${event.place}</p>
                    </div>
                    <h2 class="card-title">${event.name}</h2>
                    <p class="card-text">${event.description}</p>

                    <p id="date">${event.date}</p>

                    <div>
                        <h6>Price $${event.price}</h6>
                        <a href="./details.html?id=${event._id}" class="btn btn-primary">Go to</a>
                    </div>
                </div>
            </div>`;
    });

    container.innerHTML = cards;
};

function eventsFilter(array) {
    let dataFilter = []
    for (i = 0; i < array.length; i++) {
        if (array[i].date > data.currentDate) {
            dataFilter.push(array[i]);
        };
    };

    return dataFilter;
};

function searchbarFilter(array, searchText) {
    return array.filter(card => card.name.toLowerCase().includes(searchText.toLowerCase()));
};

function filterByCategory(array) {
    let checkboxes = Array.from(document.querySelectorAll("input[type='checkbox']"));
    let checkboxesChecked = checkboxes.filter(checkbox => checkbox.checked);
    let checkedValue = checkboxesChecked.map(checked => checked.value);

    let filteredData = array.filter(card => checkedValue.includes(card.category));

    if (checkboxesChecked.length > 0) return filteredData;

    return array;
};

function dataFilter() {
    let barFilter = searchbarFilter(dateFilter, search.value);
    let checkFilter = filterByCategory(barFilter);
    showCards(checkFilter);
};

//Events
categorySearch.addEventListener('change', dataFilter);
search.addEventListener('input', dataFilter);