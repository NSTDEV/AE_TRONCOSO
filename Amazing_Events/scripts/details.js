const querySearch = document.location.search;
const id = new URLSearchParams(querySearch).get('id');
const containerDetails = document.getElementById('div-container');
const eventDetails = data.events.find(event => event._id == id);

containerDetails.innerHTML = `
            <div class="details-container">
                <img src="${eventDetails.image}" alt="">

                <div class="details-section">
                <h2 class="card-subtitle">${eventDetails.category}</h2>
                    <h2 class="card-title">${eventDetails.name}</h2>

                    <p id="date">${eventDetails.date}</p>
                    <p class="card-text">${eventDetails.description}</p>

                    <div class="details-footer">

                    <div class="title-container">
                        <p class="colorText">${eventDetails.place}</p>
                        <p>Capacity: ${eventDetails.capacity}</p>
                    </div>

                        <div class="price-container">
                            <h6>Price: ${eventDetails.price} U$D</h6>
                        </div>

                    </div>
                </div>
            </div>`;