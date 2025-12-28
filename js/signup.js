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
    
  // ❌ EMAIL EXISTS
  if (res.status === 409) {
    window.location.href = "signup-result.html?status=error";
    return;
  }

// ❌ OTHER ERRORS
if (!res.ok) {
  window.location.href = "signup-result.html?status=error";
  return;
}


    // ✅ Store auth
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    
    // ✅ REDIRECT ONLY AFTER SUCCESS
    window.location.href = "signup-result.html?status=success";
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1500);

  } catch (err) {
    window.location.href = "signup-result.html?status=error";
    
  }
    
});
