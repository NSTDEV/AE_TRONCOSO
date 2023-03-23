let container;
const search = document.getElementById('search-box');
const categorySearch = document.getElementById('categories');

const querySearch = document.location.search;
const id = new URLSearchParams(querySearch).get('id');

let data, dateFilter;
const URL = 'https://mindhub-xj03.onrender.com/api/amazing';
const URLJson = './scripts/amazing.json';

//Fetch
async function fetchData() {
    try {
        data = await fetch(URL)
            .then(response => response.json());
    }
    catch (error) {
        data = await fetch(URLJson)
            .then(response => response.json())

            .catch(error => { console.log('Sorry we have no content to show right now... :( Try again later, ' + error); });
    };

    return data;
};

//Functions calls
dataReturn();

//Functions
async function dataReturn() {
    await fetchData();

    //Find the container to display cards
    if (document.querySelector('#past-container')) {
        container = document.getElementById('past-container');
        dateFilter = pastEventsFilter(data.events);
        showCards(dateFilter);
        showCheckboxs(dateFilter);

    } else if (document.querySelector('#upcoming-container')) {
        container = document.getElementById('upcoming-container');
        dateFilter = upcomingEventsFilter(data.events);
        showCards(dateFilter);
        showCheckboxs(dateFilter);

    } else if (document.querySelector('#card-container')) {
        container = document.getElementById('card-container');
        showCards(data.events);
        showCheckboxs(data.events);

    } else if (document.getElementById('div-container')) {
        container = document.getElementById('div-container');
        let eventID = data.events.find(event => event._id == id);

        showDetails(eventID);
    };

};

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
        container.innerHTML = `
            <div id="no-content" >
                <h2 class="no-content">There's not event whit that name...</h2>
                <i class="fa fa-exclamation-triangle"></i>
            </div>`
        return;
    };

    let cards = '';
    array.forEach((event) => {
        cards += `
            <div class="card">
                <img src="${event.image}" class="card-img" alt="Cinema">
                <div class="card-body">
                    <div class="title-container">
                        <h2 class="card-title">${event.name}</h2>
                    </div>

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

function showDetails(array) {
    container.innerHTML = `
            <div class="details-container">
                <img src="${array.image}" alt="">
                <div class="details-section">
                <h2 class="card-subtitle">${array.category}</h2>
                    <h2 class="card-title-details">${array.name}</h2>
                    <p id="date">${array.date}</p>
                    <p class="card-text">${array.description}</p>
                    <div class="details-footer">
                        <div class="title-container">
                            <p>${array.place}</p>
                            <p>Capacity: ${array.capacity}</p>
                        </div>
                        <div class="price-container">
                            <p id="assistance">${array.assistance !== undefined ? 'Assistance: ' : 'Assistance Estimate: '}${array.assistance !== undefined ? array.assistance : array.estimate}</p>
                            <h6>Price: ${array.price} U$D</h6>
                        </div>
                    </div>
                </div>
            </div>`;
};

//Cards events filters
function upcomingEventsFilter(array) {
    let dataFilter = [];
    for (i = 0; i < array.length; i++) {
        if (array[i].date > data.currentDate) dataFilter.push(array[i]);
    };

    return dataFilter;
};

function pastEventsFilter(array) {
    let dataFilter = [];
    for (i = 0; i < array.length; i++) {
        if (array[i].date < data.currentDate) dataFilter.push(array[i]);
    };

    return dataFilter;
};

//Input filters
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

    if (document.querySelector('#past-container') || document.querySelector('#upcoming-container')) {
        let barFilter = searchbarFilter(dateFilter, search.value);
        let checkFilter = filterByCategory(barFilter);
        showCards(checkFilter);
    } else {
        let barFilter = searchbarFilter(data.events, search.value);
        let checkFilter = filterByCategory(barFilter);
        showCards(checkFilter);
    };
};

//Inputs events
categorySearch.addEventListener('change', dataFilter);
search.addEventListener('input', dataFilter);