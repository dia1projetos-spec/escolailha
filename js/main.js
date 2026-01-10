/**
 * Main JavaScript
 * Colégio Ilha Brasil
 * Desenvolvido por: Henrique Siqueira
 */

// ==========================================
// NAVBAR FUNCTIONALITY
// ==========================================

class Navigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.hamburger = document.getElementById('hamburger');
        this.navMenu = document.getElementById('navMenu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.dropdowns = document.querySelectorAll('.dropdown');
        
        this.init();
    }

    init() {
        // Scroll effect on navbar
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Hamburger menu toggle
        this.hamburger?.addEventListener('click', () => this.toggleMenu());
        
        // Close menu when clicking on a link
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Smooth scroll for anchor links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.smoothScroll(e));
        });

        // Dropdown functionality for mobile
        this.dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            toggle?.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        });

        // Active link on scroll
        window.addEventListener('scroll', () => this.updateActiveLink());
    }

    handleScroll() {
        if (window.scrollY > 50) {
            this.navbar?.classList.add('scrolled');
        } else {
            this.navbar?.classList.remove('scrolled');
        }
    }

    toggleMenu() {
        this.navMenu?.classList.toggle('active');
        this.hamburger?.classList.toggle('active');
    }

    closeMenu() {
        if (window.innerWidth <= 768) {
            this.navMenu?.classList.remove('active');
            this.hamburger?.classList.remove('active');
        }
    }

    smoothScroll(e) {
        const href = e.target.getAttribute('href');
        
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const offsetTop = target.offsetTop - 90; // Account for navbar height
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    }

    updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// ==========================================
// GALLERY FILTER
// ==========================================

class GalleryFilter {
    constructor() {
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.galleryItems = document.querySelectorAll('.galeria-item');
        
        this.init();
    }

    init() {
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => this.filterGallery(btn));
        });
    }

    filterGallery(selectedBtn) {
        const filter = selectedBtn.getAttribute('data-filter');

        // Update active button
        this.filterBtns.forEach(btn => btn.classList.remove('active'));
        selectedBtn.classList.add('active');

        // Filter items
        this.galleryItems.forEach(item => {
            const category = item.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }
}

// ==========================================
// SCROLL TO TOP BUTTON
// ==========================================

class ScrollToTop {
    constructor() {
        this.button = document.getElementById('scrollTop');
        this.init();
    }

    init() {
        if (!this.button) return;

        // Show/hide button on scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                this.button.classList.add('visible');
            } else {
                this.button.classList.remove('visible');
            }
        });

        // Scroll to top on click
        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ==========================================
// ANIMATIONS ON SCROLL
// ==========================================

class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements
        const animatedElements = document.querySelectorAll(
            '.noticia-card, .galeria-item, .diferencial-card, .feature-item'
        );

        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
}

// ==========================================
// GALLERY LIGHTBOX
// ==========================================

class GalleryLightbox {
    constructor() {
        this.galleryItems = document.querySelectorAll('.galeria-item');
        this.lightbox = null;
        this.init();
    }

    init() {
        this.galleryItems.forEach(item => {
            item.addEventListener('click', () => this.openLightbox(item));
        });
    }

    openLightbox(item) {
        const imgSrc = item.querySelector('img').src;
        const imgAlt = item.querySelector('img').alt;

        // Create lightbox if it doesn't exist
        if (!this.lightbox) {
            this.createLightbox();
        }

        // Set image and show lightbox
        const lightboxImg = this.lightbox.querySelector('.lightbox-img');
        const lightboxCaption = this.lightbox.querySelector('.lightbox-caption');
        
        lightboxImg.src = imgSrc;
        lightboxCaption.textContent = imgAlt;
        
        this.lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Fade in
        setTimeout(() => {
            this.lightbox.style.opacity = '1';
        }, 10);
    }

    createLightbox() {
        this.lightbox = document.createElement('div');
        this.lightbox.className = 'lightbox';
        this.lightbox.innerHTML = `
            <span class="lightbox-close">&times;</span>
            <img src="" alt="" class="lightbox-img">
            <p class="lightbox-caption"></p>
        `;

        document.body.appendChild(this.lightbox);

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .lightbox {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.95);
                z-index: 9999;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .lightbox-img {
                max-width: 90%;
                max-height: 80vh;
                object-fit: contain;
                border-radius: 10px;
            }
            
            .lightbox-caption {
                color: white;
                margin-top: 20px;
                font-size: 1.2rem;
                text-align: center;
            }
            
            .lightbox-close {
                position: absolute;
                top: 30px;
                right: 50px;
                font-size: 3rem;
                color: white;
                cursor: pointer;
                transition: 0.3s;
            }
            
            .lightbox-close:hover {
                color: #FEDD00;
            }
        `;
        document.head.appendChild(style);

        // Close lightbox
        const closeLightbox = () => {
            this.lightbox.style.opacity = '0';
            setTimeout(() => {
                this.lightbox.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 300);
        };

        this.lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) {
                closeLightbox();
            }
        });

        // Close with ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.lightbox.style.display === 'flex') {
                closeLightbox();
            }
        });
    }
}

// ==========================================
// FORM VALIDATION
// ==========================================

class FormValidator {
    constructor() {
        this.forms = document.querySelectorAll('form');
        this.init();
    }

    init() {
        this.forms.forEach(form => {
            form.addEventListener('submit', (e) => this.validateForm(e, form));
        });
    }

    validateForm(e, form) {
        const inputs = form.querySelectorAll('input[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                this.showError(input, 'Este campo é obrigatório');
            } else if (input.type === 'email' && !this.isValidEmail(input.value)) {
                isValid = false;
                this.showError(input, 'Email inválido');
            } else {
                this.removeError(input);
            }
        });

        if (!isValid) {
            e.preventDefault();
        }
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    showError(input, message) {
        input.style.borderColor = '#e74c3c';
        
        let errorElement = input.parentElement.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'error-message';
            errorElement.style.color = '#e74c3c';
            errorElement.style.fontSize = '0.85rem';
            errorElement.style.marginTop = '5px';
            errorElement.style.display = 'block';
            input.parentElement.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    removeError(input) {
        input.style.borderColor = '';
        const errorElement = input.parentElement.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }
}

// ==========================================
// LAZY LOADING IMAGES
// ==========================================

class LazyLoadImages {
    constructor() {
        this.images = document.querySelectorAll('img[data-src]');
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });

            this.images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            this.images.forEach(img => {
                img.src = img.dataset.src;
            });
        }
    }
}

// ==========================================
// COUNTER ANIMATION
// ==========================================

class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('[data-counter]');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        this.counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.counter);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }
}

// ==========================================
// INITIALIZE ALL MODULES
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new Navigation();
    new GalleryFilter();
    new ScrollToTop();
    new ScrollAnimations();
    new GalleryLightbox();
    new FormValidator();
    new LazyLoadImages();
    new CounterAnimation();

    // Console message
    console.log('%c🎓 Colégio Ilha Brasil', 'font-size: 20px; color: #009739; font-weight: bold;');
    console.log('%cDesenvolvido por: Henrique Siqueira', 'font-size: 14px; color: #002776;');
});

// ==========================================
// EXPORT FOR TESTING
// ==========================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Navigation,
        GalleryFilter,
        ScrollToTop,
        ScrollAnimations,
        GalleryLightbox,
        FormValidator,
        LazyLoadImages,
        CounterAnimation
    };
}
