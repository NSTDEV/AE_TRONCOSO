const maxMinTable = document.getElementById('maxMin')
const pastTable = document.getElementById('pastTable')
const upcomingTable = document.getElementById('upcomingTable')

let data;
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

    let pastEvents = pastEventsFilter(data.events);
    let upcomingEvents = upcomingEventsFilter(data.events);

    let pastTableFiltered = tableCategoryFilter(pastEvents);
    let upcomingTableFiltered = tableCategoryFilter(upcomingEvents);

    getAssistancePorcentaje(data.events);
    minMaxTable(pastEvents, upcomingEvents);
    showTables(pastTableFiltered, pastTable);
    showTables(upcomingTableFiltered, upcomingTable);
}

function getAssistancePorcentaje(array) {
    array.forEach(event => {
        isNaN(event.assistance)
            ? event["percentaje"] = parseFloat(((event.estimate / event.capacity) * 100).toFixed(2))
            : event["percentaje"] = parseFloat(((event.assistance / event.capacity) * 100).toFixed(2));
    });
};

function pastEventsFilter(array) {
    let dataFilter = [];
    for (i = 0; i < array.length; i++) {
        if (array[i].date < data.currentDate) dataFilter.push(array[i]);
    };

    return dataFilter;
};

function upcomingEventsFilter(array) {
    let dataFilter = [];
    for (i = 0; i < array.length; i++) {
        if (array[i].date > data.currentDate) dataFilter.push(array[i]);
    };

    return dataFilter;
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

function minMaxTable(past, upcoming) {

    let table = {
        'highestCapacity': past.sort(function (a, b) { return b.capacity - a.capacity })[0],
        'highestPercentaje': past.sort(function (a, b) { return b.percentaje - a.percentaje })[0],
        'lowestPercentaje': upcoming.sort(function (a, b) { return a.percentaje - b.percentaje })[0]
    };

    maxMinTable.innerHTML = `
                <tr>
                    <td>${table.highestPercentaje.name} (${table.highestPercentaje.percentaje}%)</td>
                    <td>${table.lowestPercentaje.name} (${table.lowestPercentaje.percentaje}%)</td>
                    <td>${table.highestCapacity.name} (${table.highestCapacity.capacity})</td>
                </tr>`;
};