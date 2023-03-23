const tabla_max_min = document.getElementById('maxMin')
const tabla_pasado = document.getElementById('pastTable')
const tabla_futuro = document.getElementById('upcomingTable')

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

    console.log(data.events);
    getAssistancePorcentaje(data.events);
};

function getAssistancePorcentaje(array) {
    array.forEach(event => {
        isNaN(event.assistance)
            ? event["percentaje"] = ((event.estimate / event.capacity) * 100)
            : event["percentaje"] = ((event.assistance / event.capacity) * 100);
    });
};

function objStatsGeneral(data) {
    let arrayPercentaje = data.events.map(event => ({
        'name': event.name,
        'percentaje': parseFloat(((event.assistance ? event.assistance : event.estimate) * 100 / event.capacity).toFixed(2)),
        'capacity': event.capacity
    }));

    let generalStats = {
        'highestPercent': arrayPercentaje.sort((b, a) => a.percent - b.percent)[0],
        'lowestPercent': arrayPercentaje.sort((a, b) => a.percent - b.percent)[0],
        'largerCapacity': arrayPercentaje.sort((b, a) => a.capacity - b.capacity)[0]
    };

    return generalStats;
};

function statisticsByCategory(data) {
    let categories = Array.from([...new Set(data.map((event) => event.category))]);
    let statistics = categories.map(category => ({
        'category': category,
        'revenues': revenues(data, category),
        'AttPercent': percents(data, category)
    }))
    return statistics
}

function revenues(array, category) {
    let catArray = array.filter(event => event.category == category)
    let revenue = catArray.reduce((acc, item) => {
        return acc + item.revenues
    }, 0)
    return revenue
}

/*
    return data;
};

async function obtenerArray() {
    await fetchData();

    getAssistancePorcentaje(data.events);

    let past = pastEventsFilter(data.events, data.currentDate);
    let upcoming = upcomingEventsFilter(data.events, data.currentDate);
    let tabla1 = {
        'mayorCapacidad': past.sort(function (a, b) { return b.capacity - a.capacity })[0],
        'mayorPorcentaje': past.sort(function (a, b) { return b.porcentaje - a.porcentaje })[0],
        'menorPorcentaje': upcoming.sort(function (a, b) { return a.porcentaje - b.porcentaje })[0]
    };

    maxMinTable.innerHTML = `
            <tr>
                <td>${tabla1.mayorPorcentaje.name}: ${tabla1.mayorPorcentaje.porcentaje}%</td>
                <td>${tabla1.menorPorcentaje.name}: ${tabla1.menorPorcentaje.porcentaje}%</td>
                <td>${tabla1.mayorCapacidad.name}: (${tabla1.mayorCapacidad.capacity})</td>
            </tr>
            `;

    let tablaPasado = tablaCategorias(pastCategories, past);
    let tablaFuturo = tablaCategorias(upcomingCategories, upcoming);

    imprimirTablas(tablaPasado, pastTable);
    imprimirTablas(tablaFuturo, upcomingTable);

}

obtenerArray()

function getAssistancePorcentaje(array) {
    array.forEach(event => {
        isNaN(event.assistance)
            ? event["percentaje"] = (((event.estimate / event.capacity) * 100).toFixed(2))
            : event["percentaje"] = (((event.assistance / event.capacity) * 100).toFixed(2));
    });
};

*/