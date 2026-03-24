// --- Custom Cursor Glow ---
const cursorGlow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', (e) => {
    if (cursorGlow) {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    }
});

// --- Particle Canvas Background ---
const canvas = document.getElementById('particleCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#6c63ff', '#00d4aa', '#ff6b9d', '#ff9f43', '#4facfe'];

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.alpha = Math.random() * 0.5 + 0.1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.alpha;
            ctx.fill();
        }
    }

    function initParticles() {
        particles.length = 0;
        let numParticles = (window.innerWidth * window.innerHeight) / 15000;
        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initParticles();
    });
}

// --- Navigation Toggle (Mobile) ---
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// --- Sticky Navbar & Active Link Update ---
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(li => {
        li.classList.remove('active');
        if (li.dataset.section === current) {
            li.classList.add('active');
        }
    });
});

// --- Typewriter Effect ---
const typewriter = document.getElementById('typewriter');
if (typewriter) {
    const words = ['Aspiring Machine Learning Engineer', 'Aspiring Computer Vision Expert', 'Aspiring Data Analyst', 'Aspiring Data Scientist', 'Problem Solver', 'Aspiring Full Stack Developer'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            typewriter.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriter.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000; // Pause at end of word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500; // Pause before new word
        }

        setTimeout(type, typeSpeed);
    }

    setTimeout(type, 1000);
}

// --- Animate on Scroll (Intersection Observer) ---
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // If it's a skill category, trigger skill level bar animations
            if (entry.target.classList.contains('skill-category')) {
                const levels = entry.target.querySelectorAll('.skill-level');
                levels.forEach(level => {
                    const targetWidth = level.getAttribute('data-level');
                    level.style.setProperty('--level', targetWidth + '%');
                    // Small delay to ensure transition triggers
                    setTimeout(() => {
                        level.classList.add('animate');
                    }, 100);
                });
            }
            // If it's an edu-card, trigger score-fill bar animations
            if (entry.target.classList.contains('edu-card')) {
                const fills = entry.target.querySelectorAll('.score-fill');
                fills.forEach(fill => {
                    const targetScore = fill.getAttribute('data-score');
                    fill.style.setProperty('--score', targetScore + '%');
                    setTimeout(() => {
                        fill.classList.add('animate');
                    }, 100);
                });
            }
            // If it's a soft-skill-card, animate the SVG ring
            if (entry.target.classList.contains('soft-skill-card')) {
                const ring = entry.target.querySelector('.ring-fill');
                if (ring) {
                    const percent = parseFloat(ring.getAttribute('data-percent')) || 0;
                    const circumference = 2 * Math.PI * 52; // r=52
                    const offset = circumference - (circumference * percent / 100);
                    setTimeout(() => {
                        ring.style.strokeDashoffset = offset;
                    }, 150);
                }
            }
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// Also observe edu-cards that might not have animate-on-scroll class
document.querySelectorAll('.edu-card.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// --- Stats Counter Animation ---
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.stat-number');
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                const duration = 2000;
                const start = Date.now();

                function updateCounter() {
                    const now = Date.now();
                    const progress = Math.min((now - start) / duration, 1);
                    // ease out quad
                    const current = Math.floor(target * (1 - (1 - progress) * (1 - progress)));

                    counter.innerText = current;

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.innerText = target;
                    }
                }
                updateCounter();
            });
            statObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsContainer = document.querySelector('.hero-stats');
if (statsContainer) statObserver.observe(statsContainer);

// Handle smooth scrolling for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
            }
        }
    });
});

// --- FormSubmit Contact Form ---
// We will use FormSubmit.co via AJAX. It requires zero configuration.

// Use DOMContentLoaded to ensure the form and inputs are fully available
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');

    if (!contactForm) {
        console.error('Contact form not found!');
        return;
    }

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        console.log('Form submission intercepted');

        const btnSpan = submitBtn.querySelector('span');
        const btnIcon = submitBtn.querySelector('i');

        // Capture inputs
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const subjectInput = document.getElementById('subject');
        const messageInput = document.getElementById('message');

        if (!nameInput || !emailInput || !subjectInput || !messageInput) {
            console.error('One or more form inputs not found');
            return;
        }

        // Using FormSubmit.co to send the email directly to you
        fetch("https://formsubmit.co/ajax/Sumitkrbarnwal1@gmail.com", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                Name: nameInput.value.trim(),
                Email: emailInput.value.trim(),
                Subject: subjectInput.value.trim(),
                Message: messageInput.value.trim(),
                _subject: "New Message from Portfolio: " + subjectInput.value.trim()
            })
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errData => {
                        throw new Error(errData.message || "Network Error");
                    });
                }
                return response.json();
            })
            .then(data => {
                if (data.success === "true" || data.success === true) {
                    showToast(true, 'Message Sent! 🎉', "Thanks for reaching out — I'll reply soon.");
                    contactForm.reset();
                } else {
                    throw new Error(data.message || "Failed to send message");
                }
            })
            .catch((err) => {
                console.error('FormSubmit error:', err);
                const isLocal = window.location.protocol === 'file:';
                const errMsg = isLocal
                    ? 'Security Error: Forms cannot be submitted directly from a local file (file:///). Please run this via a local server or host it online.'
                    : (err.message || 'Please check your internet connection or email me directly.');
                showToast(false, 'Oops! Something went wrong.', errMsg);
            })
            .finally(() => {
                submitBtn.disabled = false;
                if (btnSpan) btnSpan.textContent = 'Send Message';
                if (btnIcon) btnIcon.className = 'fas fa-paper-plane';
            });
    });
});

// --- Toast Helpers ---
let toastTimer = null;

function showToast(success, title, msg) {
    const toast = document.getElementById('toast');
    const icon = document.getElementById('toastIcon');
    const titleEl = document.getElementById('toastTitle');
    const msgEl = document.getElementById('toastMsg');

    if (!toast || !icon || !titleEl || !msgEl) return;

    icon.className = success ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
    toast.className = 'toast ' + (success ? 'toast-success' : 'toast-error') + ' show';
    titleEl.textContent = title;
    msgEl.textContent = msg;

    clearTimeout(toastTimer);
    toastTimer = setTimeout(closeToast, 5000);
}

function closeToast() {
    const toast = document.getElementById('toast');
    if (toast) toast.classList.remove('show');
}
