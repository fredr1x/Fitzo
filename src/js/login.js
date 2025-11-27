document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;

    const error = document.getElementById("loginError");
    error.textContent = "";
    let users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        error.textContent = "Invalid email or password.";
        return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));
    window.location.href = "main.html";
});
