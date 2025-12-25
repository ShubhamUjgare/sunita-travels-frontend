// signup.js
// Depends on config.js -> API_BASE_URL

const signupForm = document.getElementById("signupForm");
const statusContainer = document.getElementById("signupStatus");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const mobile = document.getElementById("mobile").value.trim();
  const city = document.getElementById("city").value.trim();

  // Reset UI
  statusContainer.innerHTML = "";
  statusContainer.style.display = "none";

  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
        mobile,
        city
      })
    });

    const data = await res.json();

    // ❌ EMAIL EXISTS
    if (res.status === 409) {
      showStatus("failed", "Oops! We couldn’t create your account because your email is already in use.");
      return;
    }

    // ❌ OTHER ERROR
    if (!res.ok) {
      showStatus("failed", data.message || "Signup failed. Try again.");
      return;
    }

    // ✅ SUCCESS
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    showStatus("success", "Success! Your account has been created.");

    setTimeout(() => {
      window.location.href = "login.html";
    }, 1500);

  } catch (err) {
    console.error(err);
    showStatus("failed", "Something went wrong. Please try again.");
  }
});


// ================= UI STATUS HANDLER =================

function showStatus(type, message) {
  statusContainer.style.display = "flex";

  if (type === "success") {
    statusContainer.innerHTML = `
      <div class="status-card success">
        <div class="icon">✔</div>
        <h3>Completed</h3>
        <p>${message}</p>
      </div>
    `;
  } else {
    statusContainer.innerHTML = `
      <div class="status-card failed">
        <div class="icon">✖</div>
        <h3>Failed</h3>
        <p>${message}</p>
      </div>
    `;
  }
}
