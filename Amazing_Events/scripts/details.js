const queryString = window.location.search;
const params = new URLSearchParams(queryString);
const id = params.get('_id');

const eventDetails = data.events.find(event => event.id == id);


const container = document.querySelector(".details-container");
container.innerHTML + `
        <img src="${eventDetails.image}" alt="">
        <section class="card-body">
            <div class="title-container">
                <h2 class="card-title">${eventDetails.category}</h2>
                <p>${dateventDetailsa.capacity}</p>
            </div>

            <h2 class="card-title">${eventDetails.name}</h2>
            <p class="card-text">${eventDetails.description}</p>

            <div class="card-data">
                <p class="colorText">${eventDetails.place}</p>
                <p class="colorText">${eventDetails.date}</p>
            </div>
            <h6>$${eventDetails.price}</h6>
        </section>`;

console.log([document])