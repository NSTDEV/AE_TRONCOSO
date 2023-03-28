//Filters
let container;
const search = document.getElementById('search-box');
const categorySearch = document.getElementById('categories');

//Details
const querySearch = document.location.search;
const id = new URLSearchParams(querySearch).get('id');

//Stats
const maxMinTable = document.getElementById('maxMin');
const pastTable = document.getElementById('pastTable');
const upcomingTable = document.getElementById('upcomingTable');

//Fetch
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
    switch (true) {
        case Boolean(document.getElementById('past-container')):
            dateFilter = pastEventsFilter(data.events);
            showAllData(dateFilter, 'past-container');
            break;

        case Boolean(document.getElementById('upcoming-container')):
            dateFilter = upcomingEventsFilter(data.events);
            showAllData(dateFilter, 'upcoming-container');
            break;

        case Boolean(document.getElementById('card-container')):
            showAllData(data.events, 'card-container');
            break;

        case Boolean(document.getElementById('div-container')):
            container = document.getElementById('div-container');
            let eventID = data.events.find(event => event._id == id);
            showDetails(eventID);
            break;

        case Boolean(document.querySelector('.table-container')):
            let pastEvents = pastEventsFilter(data.events);
            let upcomingEvents = upcomingEventsFilter(data.events);

            let pastTableFiltered = tableCategoryFilter(pastEvents);
            let upcomingTableFiltered = tableCategoryFilter(upcomingEvents);

            getAssistancePorcentaje(data.events);
            minMaxTable(pastEvents);
            showTables(pastTableFiltered, pastTable);
            showTables(upcomingTableFiltered, upcomingTable);
            break;
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
                            <p><span>Where?</span>: ${array.place}</p>
                            <p><span>Capacity</span>: ${array.capacity}</p>
                        </div>
                        <div class="price-container">
                            <p id="assistance">${array.assistance !== undefined ? '<span>Assistance</span>: ' : '<span>Assistance Estimate</span>: '}${array.assistance !== undefined ? array.assistance : array.estimate}</p>
                            <h6>Price: ${array.price} U$D</h6>
                        </div>
                    </div>
                </div>
            </div>`;
};

function showAllData(array, stringContainer) {
    container = document.getElementById(stringContainer);

    showCards(array);
    showCheckboxs(array);

    //Events
    categorySearch.addEventListener('change', dataFilter);
    search.addEventListener('input', dataFilter);
};

//--STATS--
function getAssistancePorcentaje(array) {
    array.forEach(event => {
        isNaN(event.assistance)
            ? event["percentaje"] = parseFloat(((event.estimate / event.capacity) * 100).toFixed(2))
            : event["percentaje"] = parseFloat(((event.assistance / event.capacity) * 100).toFixed(2));
    });
};

function tableCategoryFilter(array) {
    let filter = Array.from(new Set(array.map(dataIndex => dataIndex.category)));
    let table = [];

    for (let i = 0; i < filter.length; i++) {
        table.push([]);

        for (const event of array) {
            if (filter[i] == event.category) table[i].push(event);
        };
    };

    return table;
};

function showTables(array, table) {
    let tableContent = ``;
    for (let i = 0; i < array.length; i++) {

        let revenue = 0;
        let tablePercentaje = 0;
        let category;

        for (const event of array[i]) {
            category = event.category;
            revenue += event.price * (isNaN(event.assistance) ? event.estimate : event.assistance);
            tablePercentaje += event.percentaje;
        };

        averagePercentaje = tablePercentaje / (array[i].length);

        tableContent += `
                <tr>
                    <td>${category}</td>
                    <td>$${revenue} U$D</td>
                    <td>${parseFloat(averagePercentaje.toFixed(2))}%</td>
                </tr>`;

        table.innerHTML = tableContent;
    };
};

function minMaxTable(past) {

    let table = {
        'highestCapacity': past.sort(function (a, b) { return b.capacity - a.capacity })[0],
        'highestPercentaje': past.sort(function (a, b) { return b.percentaje - a.percentaje })[0],
        'lowestPercentaje': past.sort(function (a, b) { return a.percentaje - b.percentaje })[0]
    };

    maxMinTable.innerHTML = `
                <tr>
                    <td>${table.highestPercentaje.name} (${table.highestPercentaje.percentaje}%)</td>
                    <td>${table.lowestPercentaje.name} (${table.lowestPercentaje.percentaje}%)</td>
                    <td>${table.highestCapacity.name} (${table.highestCapacity.capacity})</td>
                </tr>`;
};

//Event filters
function upcomingEventsFilter(array) {
    return array.filter(event => event.date > data.currentDate);
};

function pastEventsFilter(array) {
    return array.filter(event => event.date < data.currentDate);
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