// login.js
// Depends on config.js -> API_BASE_URL

const loginForm = document.getElementById("loginForm");
const statusContainer = document.getElementById("loginStatus");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  statusContainer.innerHTML = "";
  statusContainer.style.display = "none";

  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    // ❌ INVALID LOGIN
    if (!res.ok) {
      showStatus(
        "failed",
        data.message || "Invalid email or password"
      );
      return;
    }

    // ✅ SUCCESS
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    showStatus("success", "Login successful!");

    setTimeout(() => {
      window.location.href = "index.html";
    }, 1200);

  } catch (err) {
    console.error(err);
    showStatus("failed", "Unable to login. Try again later.");
  }
});

// ================= UI STATUS HANDLER =================

function showStatus(type, message) {
  statusContainer.style.display = "flex";

  if (type === "success") {
    statusContainer.innerHTML = `
      <div class="status-card success">
        <div class="icon">✔</div>
        <h3>Success</h3>
        <p>${message}</p>
      </div>
    `;
  } else {
    statusContainer.innerHTML = `
      <div class="status-card failed">
        <div class="icon">✖</div>
        <h3>Login Failed</h3>
        <p>${message}</p>
      </div>
    `;
  }
}
