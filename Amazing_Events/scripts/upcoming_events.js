const upcomingContainer = document.getElementById('upcoming-container');

let dateFilter = eventFilter(data.events, data.currentDate);

function showData(containerData) {
    for (eventData of dateFilter) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <img src="${eventData.image}" class="card-img" alt="Cinema">
            <div class="card-body">
                <div class="title-container">
                    <h5 class="card-title">${eventData.category}</h5>
                    <p class="colorText">${eventData.place}</p>
                </div>
                <h2 class="card-title">${eventData.name}</h2>
                <p class="card-text">${eventData.description}</p>

                <div class="card-data">
                    <p>Capacity: ${eventData.capacity}</p>
                    <p class="colorText">Date: ${eventData.date}</p>
                </div>

                <div>
                    <h6>Price $${eventData.price}</h6>
                    <a href="./details.html" class="btn btn-primary">Go to</a>
                </div>
            </div>`

        containerData.append(card);
    };
};

function eventFilter(events, currentDate) {
    let dataFilter = []
    for (i = 0; i < events.length; i++) {
        if (events[i].date > currentDate) {
            dataFilter.push(events[i]);
        };
    };
    return dataFilter;
};

showData(upcomingContainer);