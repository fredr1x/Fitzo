document.getElementById('profileBtn')?.addEventListener('click', () => {
    window.location.href = 'profile.html';
});

document.querySelectorAll('.plans .btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();

        const planCard = btn.closest('.plan-card');
        const priceElement = planCard.querySelector('.price-amount');
        const planNameElement = planCard.querySelector('.plan-name');

        const price = parseInt(priceElement.textContent.replace('$', ''));
        const planName = planNameElement.textContent;

        sessionStorage.setItem('purchasedPlan', JSON.stringify({
            name: planName,
            price: price
        }));

        window.location.href = 'profile.html';
    });
});

const congratsModal = document.getElementById('congratsModal');
const modalClose = document.querySelector('.modal-close');

if (modalClose) {
    modalClose.addEventListener('click', () => {
        congratsModal.style.display = 'none';
    });
}

window.addEventListener('click', (e) => {
    if (e.target === congratsModal) {
        congratsModal.style.display = 'none';
    }
});

class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        if (this.form) this.init();
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
    new ContactForm();
    new ScrollAnimations();
    new SmoothScroll();

    const navToggle = document.querySelector(".nav-toggle");
    const navMenu = document.querySelector(".nav-menu");

    if (navToggle && navMenu) {
        navToggle.addEventListener("click", () => {
            navMenu.classList.toggle("active");
            navToggle.classList.toggle("open");
        });

        document.querySelectorAll(".nav-link").forEach(link => {
            link.addEventListener("click", () => {
                if (window.innerWidth <= 968) {
                    navMenu.classList.remove("active");
                    navToggle.classList.remove("open");
                }
            });
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 968) {
                navMenu.classList.remove("active");
                navToggle.classList.remove("open");
            }
        });
    }
});
