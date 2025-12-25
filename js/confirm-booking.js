// confirm-booking.js
// Depends on config.js -> API_BASE_URL

const params = new URLSearchParams(window.location.search);

const bookingData = {
  ride: params.get("ride"),
  pickup: params.get("pickup"),
  destination: params.get("destination"),
  distance: params.get("distance"),
  journeyType: params.get("journeyType"),
  date: new Date().toLocaleDateString()
};

// Render booking details
document.getElementById("ride").innerText = bookingData.ride;
document.getElementById("pickup").innerText = bookingData.pickup;
document.getElementById("destination").innerText = bookingData.destination;
document.getElementById("distance").innerText = bookingData.distance;
document.getElementById("journeyType").innerText = bookingData.journeyType;

// ======================= CONFIRM BOOKING =======================

document.getElementById("confirmBookingBtn").addEventListener("click", async () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    alert("Please login first");
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        ...bookingData,
        name: user.name,
        email: user.email,
        mobile: user.mobile
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Booking failed");
      return;
    }

    // Save latest booking locally
    localStorage.setItem("latestBooking", JSON.stringify({
      ...bookingData,
      bookingId: data.booking._id
    }));

    sendBookingToWhatsApp(user, bookingData, data.booking._id);

    window.location.href = "my-trips.html";

  } catch (err) {
    console.error(err);
    alert("Something went wrong while booking");
  }
});

// ======================= WHATSAPP =======================

function sendBookingToWhatsApp(user, booking, bookingId) {
  const msg =
`📍 *New Booking Received*
👤 Name: ${user.name}
📧 Email: ${user.email}
📞 Mobile: ${user.mobile}

🚗 Ride: ${booking.ride}
📌 Pickup: ${booking.pickup}
🏁 Destination: ${booking.destination}
📏 Distance: ${booking.distance} km
🧾 Booking ID: ${bookingId}`;

  const encodedMsg = encodeURIComponent(msg);
  window.open(`https://wa.me/8850814933?text=${encodedMsg}`, "_blank");
}
