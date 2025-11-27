document.getElementById('profileBtn').addEventListener('click', () => {
    window.location.href = 'profile.html'
});

document.querySelectorAll('.plans .btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const modal = document.getElementById('congratsModal');
        modal.style.display = 'flex';
    });
});

document.querySelector('.modal-close').addEventListener('click', () => {
    document.getElementById('congratsModal').style.display = 'none';
});

window.addEventListener('click', (e) => {
    const modal = document.getElementById('congratsModal');
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);

        this.showNotification('Message sent successfully! We will get back to you soon.', 'success');
        this.form.reset();
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
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
}

class BalanceForm {
    constructor(walletManager) {
        this.walletManager = walletManager;
        this.form = document.getElementById('addBalanceForm');
        this.amountInput = document.getElementById('amount');
        this.quickAmountBtns = document.querySelectorAll('.quick-amount-btn');
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        this.quickAmountBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const amount = btn.dataset.amount;
                this.amountInput.value = amount;
                this.amountInput.focus();
            });
        });
    }

    handleSubmit(e) {
        e.preventDefault();

        const amount = this.amountInput.value;
        const success = this.walletManager.addBalance(amount);

        if (success) {
            this.showNotification(`Successfully added $${parseFloat(amount).toFixed(2)} to your wallet!`, 'success');
            this.form.reset();

            setTimeout(() => {
                document.querySelector('.modal-close').click();
            }, 1000);
        } else {
            this.showNotification('Please enter a valid amount', 'error');
        }
    }

    showNotification(message, type) {
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
}

class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, this.observerOptions);

        const animatedElements = document.querySelectorAll(
            '.workout-card, .trainer-card, .plan-card, .contact-item'
        );

        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
}

class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href !== '#' && href.length > 1) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const offsetTop = target.offsetTop - 80;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }
}

const animationStyles = document.createElement('style');
animationStyles.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(animationStyles);

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = new ContactForm();
    const scrollAnimations = new ScrollAnimations();
    const smoothScroll = new SmoothScroll();
});

