document.getElementById('homeBtn').addEventListener('click', () => {
    window.location.href = 'main.html';
});

const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser) {
    window.location.href = "login.html";
}

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

window.addEventListener('DOMContentLoaded', () => {
    const purchasedPlan = sessionStorage.getItem('purchasedPlan');

    if (purchasedPlan) {
        const planData = JSON.parse(purchasedPlan);
        processPlanPurchase(planData);
        sessionStorage.removeItem('purchasedPlan');
    }
});

function processPlanPurchase(planData) {
    const currentBalance = Number(currentUser.balance);
    const planPrice = planData.price;

    if (currentBalance >= planPrice) {
        const newBalance = currentBalance - planPrice;
        profileBalance.textContent = "$" + newBalance;

        profilePlan.textContent = planData.name;

        updateUserField("balance", newBalance);
        updateUserField("plan", planData.name);

        showPurchaseModal('success', `Поздравляю! Вы успешно приобрели план "${planData.name}" за $${planPrice}!`);
    } else {
        const needed = planPrice - currentBalance;
        showPurchaseModal('error', `Недостаточно средств. Вам нужно еще $${needed.toFixed(2)}. Пожалуйста, пополните баланс.`);
    }
}

function showPurchaseModal(type, message) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${type === 'success' ? 'Успешно!' : 'Ошибка'}</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <p style="text-align: center; padding: 20px; font-size: 16px;">${message}</p>
                <button class="auth-btn" style="width: 100%;">ОК</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const closeModal = () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    };

    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.auth-btn').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

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
    if (isNaN(amount) || amount <= 0) {
        showNotification('Пожалуйста, введите корректную сумму', 'error');
        return;
    }
    const newBalance = Number(currentUser.balance) + amount;
    profileBalance.textContent = "$" + newBalance;
    updateUserField("balance", newBalance);
    balanceModal.classList.remove("active");
    showNotification(`Успешно добавлено $${amount.toFixed(2)} на ваш баланс!`, 'success');
});

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.textContent = message;

    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        background: type === 'success' ? '#2ecc71' : '#e74c3c',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
        zIndex: '3000',
        animation: 'slideInRight 0.3s ease',
        fontWeight: '600'
    });

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}