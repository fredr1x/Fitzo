document.getElementById("registerForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const error = document.getElementById("registerError");
    error.textContent = "";

    if (!fullName || !email || !password || !confirmPassword) {
        error.textContent = "Please fill out all fields.";
        return;
    }

    if (password !== confirmPassword) {
        error.textContent = "Passwords do not match.";
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const existed = users.find(u => u.email === email);
    if (existed) {
        error.textContent = "This email is already registered.";
        return;
    }

    const newUser = {
        fullName: fullName,
        email: email,
        password: password,
        balance: 0 // по твоей логике
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    window.location.href = "login.html";
});
