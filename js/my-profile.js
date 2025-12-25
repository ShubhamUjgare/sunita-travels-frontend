// my-profile.js
// Depends on config.js -> API_BASE_URL

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (!token || !user) {
  alert("Please login to view your profile");
  window.location.href = "login.html";
}

// Elements
const nameEl = document.getElementById("profileName");
const emailEl = document.getElementById("profileEmail");
const mobileEl = document.getElementById("profileMobile");
const cityEl = document.getElementById("profileCity");
const joinedEl = document.getElementById("profileJoined");

// Load profile
async function loadProfile() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error("Unauthorized");
    }

    const data = await res.json();

    nameEl.innerText = data.name;
    emailEl.innerText = data.email;
    mobileEl.innerText = data.mobile || "-";
    cityEl.innerText = data.city || "-";
    joinedEl.innerText = new Date(data.createdAt).toLocaleDateString();

  } catch (err) {
    console.error(err);
    alert("Session expired. Please login again.");
    localStorage.clear();
    window.location.href = "login.html";
  }
}

loadProfile();

// Logout
function logoutProfile() {
  localStorage.clear();
  window.location.href = "login.html";
}
