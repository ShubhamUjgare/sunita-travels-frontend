// choose-ride.js

/************************************
 READ QUERY PARAMETERS
*************************************/
const params = new URLSearchParams(window.location.search);

const pickup = params.get("pickup");
const destination = params.get("destination");
const distance = Number(params.get("distance"));
const journeyType = params.get("journeyType");

document.getElementById("dist").innerText = distance;

/************************************
 DRAW MAP (OSM + OSRM)
*************************************/
(async () => {
  try {
    const geocode = async place =>
      (await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`
      )).json();

    const p = (await geocode(pickup))[0];
    const d = (await geocode(destination))[0];

    if (!p || !d) return;

    const map = L.map("map").setView([p.lat, p.lon], 7);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

    const route = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${p.lon},${p.lat};${d.lon},${d.lat}?overview=full&geometries=geojson`
    ).then(r => r.json());

    L.geoJSON(route.routes[0].geometry, {
      style: { color: "#2e7d32", weight: 4 }
    }).addTo(map);

    map.fitBounds([
      [p.lat, p.lon],
      [d.lat, d.lon]
    ]);
  } catch (err) {
    console.error("Map error:", err);
  }
})();

/************************************
 SELECT RIDE
*************************************/
let selectedCard = document.querySelector(".ride-card.active");
const confirmBtn = document.getElementById("confirmBtn");

document.querySelectorAll(".ride-card").forEach(card => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".ride-card")
      .forEach(c => c.classList.remove("active"));

    card.classList.add("active");
    selectedCard = card;
    confirmBtn.innerText = `Choose ${card.dataset.name}`;
  });
});

/************************************
 CONFIRM BOOKING → CONFIRM PAGE
*************************************/
confirmBtn.addEventListener("click", () => {
  if (!selectedCard) return;

  window.location.href =
    `confirm-booking.html?ride=${encodeURIComponent(selectedCard.dataset.name)}&pickup=${encodeURIComponent(pickup)}&destination=${encodeURIComponent(destination)}&distance=${distance}&journeyType=${encodeURIComponent(journeyType)}`;
});
