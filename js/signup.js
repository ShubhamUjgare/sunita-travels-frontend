signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const phone = document.getElementById("phone").value.trim();

  statusContainer.innerHTML = "";
  statusContainer.style.display = "none";

  // ✅ Basic client validation
  if (!name || !email || !password || !phone) {
    showStatus("failed", "Please fill all required fields.");
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
        phone,
      })
    });

    const data = await res.json();

    if (res.status === 409) {
      showStatus("failed", "Oops! Email already in use.");
      return;
    }

    if (!res.ok) {
      showStatus("failed", data.message || "Signup failed.");
      return;
    }

    // ✅ Store auth
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
