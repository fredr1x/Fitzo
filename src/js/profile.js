document.getElementById('homeBtn').addEventListener('click', () => {
    window.location.href = 'main.html';
});

const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser) window.location.href = "login.html";

const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profileAvatar = document.getElementById("profileAvatar");
const profileBalance = document.getElementById("profileBalance");
const profilePlan = document.getElementById("profilePlan");

profileName.textContent = currentUser.fullName;
profileEmail.textContent = currentUser.email;
profileBalance.textContent = "$" + currentUser.balance;
profilePlan.textContent = currentUser.plan || "Free";

if (currentUser.avatar) profileAvatar.src = currentUser.avatar;

document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
});

function updateUserField(field, value) {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    const index = users.findIndex(u => u.email === currentUser.email);
    if (index === -1) return;
    users[index][field] = value;
    currentUser[field] = value;
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
}

const editProfileBtn = document.getElementById("editProfileBtn");
const editModal = document.getElementById("editProfileModal");
const closeEditModal = document.getElementById("closeEditModal");
const editName = document.getElementById("editName");
const editEmail = document.getElementById("editEmail");
const editAvatar = document.getElementById("editAvatar");
const saveProfileBtn = document.getElementById("saveProfileBtn");

editProfileBtn.addEventListener("click", () => {
    editName.value = currentUser.fullName;
    editEmail.value = currentUser.email;
    editModal.classList.add("active");
});

closeEditModal.addEventListener("click", () => editModal.classList.remove("active"));

saveProfileBtn.addEventListener("click", () => {
    if (editName.value) {
        profileName.textContent = editName.value;
        updateUserField("fullName", editName.value);
    }
    if (editEmail.value) {
        profileEmail.textContent = editEmail.value;
        updateUserField("email", editEmail.value);
    }
    if (editAvatar.files[0]) {
        const reader = new FileReader();
        reader.onload = e => {
            profileAvatar.src = e.target.result;
            updateUserField("avatar", e.target.result);
        };
        reader.readAsDataURL(editAvatar.files[0]);
    }
    editModal.classList.remove("active");
});

const addBalanceBtn = document.getElementById("addBalanceBtn");
const balanceModal = document.getElementById("addBalanceModal");
const closeBalanceModal = document.getElementById("closeBalanceModal");
const modalCurrentBalance = document.getElementById("modalCurrentBalance");
const amountInput = document.getElementById("amountInput");
const confirmAddBalance = document.getElementById("confirmAddBalance");
const quickAmountBtns = document.querySelectorAll(".quick-amount-btn");

addBalanceBtn.addEventListener("click", () => {
    modalCurrentBalance.textContent = "$" + currentUser.balance;
    amountInput.value = "";
    balanceModal.classList.add("active");
});

closeBalanceModal.addEventListener("click", () => balanceModal.classList.remove("active"));

quickAmountBtns.forEach(btn => {
    btn.addEventListener("click", () => amountInput.value = btn.dataset.amount);
});

confirmAddBalance.addEventListener("click", () => {
    let amount = Number(amountInput.value);
    if (isNaN(amount) || amount <= 0) return;
    const newBalance = Number(currentUser.balance) + amount;
    profileBalance.textContent = "$" + newBalance;
    updateUserField("balance", newBalance);
    balanceModal.classList.remove("active");
});
