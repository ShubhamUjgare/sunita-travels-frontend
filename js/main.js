// main.js
// Depends on config.js -> API_BASE_URL

/************************************
 AUTH STATE (HEADER CONTROL)
*************************************/
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");
  const profileBtn = document.getElementById("profileBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (token && user) {
    loginBtn && (loginBtn.style.display = "none");
    signupBtn && (signupBtn.style.display = "none");

    if (profileBtn) {
      profileBtn.style.display = "inline-block";
      profileBtn.innerText = user.name.split(" ")[0];
    }

    logoutBtn && (logoutBtn.style.display = "inline-block");
  } else {
    logoutBtn && (logoutBtn.style.display = "none");
    profileBtn && (profileBtn.style.display = "none");
  }
});

/************************************
 LOGOUT
*************************************/
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

/************************************
 SEARCH FORM → CHOOSE RIDE
*************************************/
const searchForm = document.getElementById("searchForm");
const swapBtn = document.getElementById("swapBtn");

swapBtn?.addEventListener("click", () => {
  const pickup = document.getElementById("pickup");
  const destination = document.getElementById("destination");
  [pickup.value, destination.value] = [destination.value, pickup.value];
});

searchForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const pickup = searchForm.pickup.value.trim();
  const destination = searchForm.destination.value.trim();
  const journeyType = searchForm.journeyType.value;

  if (!pickup || !destination || !journeyType) {
    alert("Please fill all required fields");
    return;
  }

  try {
    const distance = await getDistanceKm(pickup, destination);

    window.location.href =
      `choose-ride.html?pickup=${encodeURIComponent(pickup)}&destination=${encodeURIComponent(destination)}&distance=${distance}&journeyType=${encodeURIComponent(journeyType)}`;

  } catch {
    alert("Unable to calculate distance.");
  }
});

/************************************
 LOCATION AUTOCOMPLETE (OSM INDIA)
*************************************/
async function fetchLocations(query) {
  if (query.length < 2) return [];

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&countrycodes=in&limit=6&q=${encodeURIComponent(query)}`
  );
  return res.json();
}

function setupAutocomplete(inputId, boxId) {
  const input = document.getElementById(inputId);
  const box = document.getElementById(boxId);
  if (!input || !box) return;

  input.addEventListener("input", async () => {
    const query = input.value.trim();
    box.innerHTML = "";

    if (query.length < 2) {
      box.style.display = "none";
      return;
    }

    const results = await fetchLocations(query);
    if (!results.length) {
      box.style.display = "none";
      return;
    }

    results.forEach(place => {
      const div = document.createElement("div");
      div.className = "suggestion-item";
      div.innerHTML = `
        <i class="fa-solid fa-location-dot"></i>
        <div>
          <strong>${place.display_name.split(",")[0]}</strong><br>
          <small>${place.display_name}</small>
        </div>
      `;
      div.onclick = () => {
        input.value = place.display_name;
        box.style.display = "none";
      };
      box.appendChild(div);
    });

    box.style.display = "block";
  });

  document.addEventListener("click", (e) => {
    if (!box.contains(e.target) && e.target !== input) {
      box.style.display = "none";
    }
  });
}

// INIT AUTOCOMPLETE
setupAutocomplete("pickup", "pickupSuggestions");
setupAutocomplete("destination", "destinationSuggestions");
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const menu = document.getElementById("mobileMenu");

  if (!hamburger || !menu) return;

  hamburger.addEventListener("click", () => {
    menu.classList.toggle("open");
  });
});

