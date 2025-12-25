// my-trips.js
// Depends on config.js -> API_BASE_URL

const container = document.getElementById("tripContainer");
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

// ===================== AUTH CHECK =====================
if (!token || !user) {
  alert("Please login to view your trips");
  window.location.href = "login.html";
}

// ===================== RENDER FALLBACK =====================
function renderFallback() {
  const booking = JSON.parse(localStorage.getItem("latestBooking"));

  if (!booking) {
    container.innerHTML = `
      <div class="trip-card">
        No upcoming trips.
        <br><br>
        <a href="index.html">Plan one now!</a>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="trip-card">
      <h3>${booking.ride}</h3>
      <div class="trip-row"><strong>Pickup:</strong> ${booking.pickup}</div>
      <div class="trip-row"><strong>Destination:</strong> ${booking.destination}</div>
      <div class="trip-row"><strong>Distance:</strong> ${booking.distance} km</div>
      <div class="trip-row"><strong>Date:</strong> ${booking.date}</div>
      <div class="trip-row"><strong>Booking ID:</strong> ${booking.bookingId}</div>
    </div>
  `;
}

// ===================== FETCH FROM BACKEND =====================
async function loadTrips() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/bookings/my`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      renderFallback();
      return;
    }

    const trips = await res.json();

    if (!trips.length) {
      renderFallback();
      return;
    }

    container.innerHTML = "";

    trips.forEach(trip => {
      const card = document.createElement("div");
      card.className = "trip-card";

      card.innerHTML = `
        <h3>${trip.ride}</h3>
        <div class="trip-row"><strong>Pickup:</strong> ${trip.pickup}</div>
        <div class="trip-row"><strong>Destination:</strong> ${trip.destination}</div>
        <div class="trip-row"><strong>Distance:</strong> ${trip.distance} km</div>
        <div class="trip-row"><strong>Journey:</strong> ${trip.journeyType}</div>
        <div class="trip-row"><strong>Date:</strong> ${new Date(trip.createdAt).toLocaleDateString()}</div>
        <div class="trip-row"><strong>ID:</strong> ${trip._id}</div>

        <button class="cancel-btn" onclick="cancelBooking('${trip._id}')">
          Cancel Trip
        </button>
      `;

      container.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    renderFallback();
  }
}

loadTrips();

// ===================== CANCEL BOOKING =====================
async function cancelBooking(id) {
  const confirmCancel = confirm("Are you sure you want to cancel this booking?");
  if (!confirmCancel) return;

  try {
    const res = await fetch(`${API_BASE_URL}/api/bookings/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      alert("Unable to cancel booking");
      return;
    }

    alert("Booking cancelled successfully");
    loadTrips();

  } catch (err) {
    console.error(err);
    alert("Error cancelling booking");
  }
}
