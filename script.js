// ==========================================
// 1. TYPING ANIMATION
// ==========================================

const typingText = document.getElementById("typing-text");

if (typingText) {
    const roles = [
        "Data Science Student",
        "Python Programmer",
        "AI/ML Enthusiast",
        "Aspiring Data Scientist"
    ];

    let roleIndex = 0;
    let characterIndex = 0;
    let deleting = false;

    function typeRole() {
        const currentRole = roles[roleIndex];

        if (deleting) {
            characterIndex--;
        } else {
            characterIndex++;
        }

        typingText.textContent =
            currentRole.substring(0, characterIndex);

        let delay = deleting ? 45 : 90;

        if (!deleting && characterIndex === currentRole.length) {
            deleting = true;
            delay = 1400;
        } else if (deleting && characterIndex === 0) {
            deleting = false;

            roleIndex = (roleIndex + 1) % roles.length;

            delay = 300;
        }

        setTimeout(typeRole, delay);
    }

    typeRole();
}


// ==========================================
// 2. FLOATING PARTICLES
// ==========================================

const canvas = document.getElementById("particles");
const ctx = canvas?.getContext("2d");

let particles = [];
let animationFrameId = null;

const particleColors = [
    "#00e5ff",
    "#268bff",
    "#9855ff",
    "#ffffff"
];

let canvasWidth = 0;
let canvasHeight = 0;
let lastFrameTime = 0;

const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
);

function resizeCanvas() {
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;

    canvas.width = Math.round(canvasWidth * dpr);
    canvas.height = Math.round(canvasHeight * dpr);

    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const particleCount = Math.min(
        100,
        Math.max(35, Math.floor((canvasWidth * canvasHeight) / 14000))
    );

    particles = Array.from(
        { length: particleCount },
        () => createParticle(true)
    );
}

function createParticle(randomPosition = false) {
    return {
        x: Math.random() * canvasWidth,

        y: randomPosition
            ? Math.random() * canvasHeight
            : canvasHeight + 10,

        radius: Math.random() * 2 + 0.5,

        speedX: (Math.random() - 0.5) * 0.35,

        speedY: Math.random() * 0.45 + 0.12,

        opacity: Math.random() * 0.65 + 0.2,

        color: particleColors[
            Math.floor(Math.random() * particleColors.length)
        ]
    };
}

function drawParticles(timestamp = 0) {
    if (!ctx || !canvas) return;

    // Limit the animation to approximately 30 frames per second.
    if (timestamp - lastFrameTime < 33) {
        animationFrameId = requestAnimationFrame(drawParticles);
        return;
    }

    lastFrameTime = timestamp;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    particles.forEach((particle, index) => {
        ctx.beginPath();

        ctx.arc(
            particle.x,
            particle.y,
            particle.radius,
            0,
            Math.PI * 2
        );

        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;

        ctx.shadowBlur = 10;
        ctx.shadowColor = particle.color;

        ctx.fill();

        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;

        if (!reduceMotion.matches) {
            particle.x += particle.speedX;
            particle.y -= particle.speedY;

            if (particle.x < -10) {
                particle.x = canvasWidth + 10;
            }

            if (particle.x > canvasWidth + 10) {
                particle.x = -10;
            }

            if (particle.y < -10) {
                particles[index] = createParticle(false);
            }
        }
    });

    // Draw subtle connecting lines between nearby particles.
    if (!reduceMotion.matches) {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;

                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.beginPath();

                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);

                    ctx.strokeStyle = "#268bff";

                    ctx.globalAlpha =
                        (1 - distance / 100) * 0.18;

                    ctx.lineWidth = 0.6;

                    ctx.stroke();

                    ctx.globalAlpha = 1;
                }
            }
        }
    }

    animationFrameId = requestAnimationFrame(drawParticles);
}

function startParticles() {
    if (!ctx || animationFrameId !== null) return;

    animationFrameId = requestAnimationFrame(drawParticles);
}

function stopParticles() {
    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
}

if (canvas && ctx) {
    resizeCanvas();
    startParticles();

    window.addEventListener("resize", resizeCanvas);

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            stopParticles();
        } else {
            startParticles();
        }
    });

    reduceMotion.addEventListener?.("change", () => {
        particles = particles.map((particle) => ({
            ...particle,
            speedX: reduceMotion.matches ? 0 : (Math.random() - 0.5) * 0.35,
            speedY: reduceMotion.matches ? 0 : Math.random() * 0.45 + 0.12
        }));
    });
}


// ==========================================
// 3. MOBILE NAVIGATION
// ==========================================

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("active");

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuToggle.textContent = isOpen ? "✕" : "☰";
    });

    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");

            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.textContent = "☰";
        });
    });
}


// ==========================================
// 4. ACTIVE NAVIGATION LINK
// ==========================================

const sections = document.querySelectorAll("main section[id]");
const navigationLinks = document.querySelectorAll(".nav-links a");

if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                const activeId = entry.target.id;

                navigationLinks.forEach((link) => {
                    const isActive =
                        link.getAttribute("href") === `#${activeId}`;

                    link.classList.toggle("active", isActive);
                });
            });
        },
        {
            rootMargin: "-25% 0px -60% 0px"
        }
    );

    sections.forEach((section) => {
        sectionObserver.observe(section);
    });
}


// ==========================================
// 5. SCROLL REVEAL
// ==========================================

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");

                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12
        }
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });
} else {
    revealElements.forEach((element) => {
        element.classList.add("visible");
    });
}


// ==========================================
// 6. DARK / LIGHT MODE
// ==========================================

// ==========================================
// DARK AND LIGHT THEME TOGGLE
// ==========================================

const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

function applyTheme(theme) {
    const isLight = theme === "light";

    body.classList.toggle("light-mode", isLight);

    if (themeToggle) {
        themeToggle.textContent = isLight ? "☾" : "☀";
        themeToggle.setAttribute(
            "aria-label",
            isLight ? "Switch to dark theme" : "Switch to light theme"
        );

        themeToggle.setAttribute("aria-pressed", String(isLight));
    }

    localStorage.setItem("portfolio-theme", theme);
}

// Restore the user's previously selected theme.

const savedTheme = localStorage.getItem("portfolio-theme");

applyTheme(savedTheme === "light" ? "light" : "dark");

// Toggle the theme when the button is clicked.

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const isCurrentlyLight = body.classList.contains("light-mode");

        applyTheme(isCurrentlyLight ? "dark" : "light");
    });
}
// ==========================================
// 7. BACK TO TOP BUTTON
// ==========================================

const backToTop = document.getElementById("back-to-top");

function updateBackToTop() {
    if (!backToTop) return;

    backToTop.classList.toggle(
        "show",
        window.scrollY > 350
    );
}

window.addEventListener("scroll", updateBackToTop, {
    passive: true
});

updateBackToTop();

if (backToTop) {
    backToTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: reduceMotion.matches ? "auto" : "smooth"
        });
    });
}


// ==========================================
// 8. CONTACT FORM VALIDATION
// ==========================================

const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

if (contactForm && formStatus) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = contactForm.elements["name"].value.trim();
        const email = contactForm.elements["email"].value.trim();
        const message = contactForm.elements["message"].value.trim();

        if (!name || !email || !message) {
            formStatus.textContent =
                "Please complete all the fields.";

            return;
        }

        formStatus.textContent =
            "Your form is valid! Connect an email service to deliver messages.";

        // This form validates input but does not send an email.
    });
}


// ==========================================
// 9. AUTOMATIC COPYRIGHT YEAR
// ==========================================

const currentYear = document.getElementById("current-year");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}


// ==========================================
// 10. WEBSITE INITIALIZATION
// ==========================================

console.log("✨ VIMALKANTH's portfolio loaded successfully!");
// ==========================================
// CINEMATIC SCROLL TRANSFORMATION
// ==========================================

const transitionElements = document.querySelectorAll(
    ".section-heading, " +
    ".about-grid, " +
    ".skills-grid, " +
    ".projects-grid, " +
    ".timeline, " +
    ".contact-card"
);

const waveElements = document.querySelectorAll(".wave-divider");

const motionPreference = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
);

// Reveal section content as it enters the viewport.

if ("IntersectionObserver" in window) {
    const transitionObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("scroll-visible");

                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -35px 0px"
        }
    );

    transitionElements.forEach((element) => {
        transitionObserver.observe(element);
    });
} else {
    transitionElements.forEach((element) => {
        element.classList.add("scroll-visible");
    });
}


// Intensify the wave glow while it is visible.

if ("IntersectionObserver" in window) {
    const waveObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                entry.target.classList.toggle(
                    "wave-active",
                    entry.isIntersecting
                );
            });
        },
        {
            threshold: 0.25
        }
    );

    waveElements.forEach((wave) => {
        waveObserver.observe(wave);
    });
}


// Scroll-linked parallax transformation.
// This subtly moves section backgrounds at a different
// speed from the page content.

const backgroundSections = document.querySelectorAll(
    ".hero, .about-section, .skills-section, " +
    ".projects-section, .education-section, .contact-section"
);

let scrollAnimationPending = false;

function updateScrollTransformation() {
    if (motionPreference.matches) {
        scrollAnimationPending = false;
        return;
    }

    const viewportHeight = window.innerHeight;

    backgroundSections.forEach((section) => {
        const rect = section.getBoundingClientRect();

        if (
            rect.bottom < -100 ||
            rect.top > viewportHeight + 100
        ) {
            return;
        }

        const progress =
            (viewportHeight - rect.top) /
            (viewportHeight + rect.height);

        const normalizedProgress = Math.max(
            0,
            Math.min(1, progress)
        );

        const parallaxY =
            (normalizedProgress - 0.5) * 22;

        section.style.setProperty(
            "--scroll-parallax",
            `${parallaxY.toFixed(2)}px`
        );
    });

    scrollAnimationPending = false;
}

window.addEventListener(
    "scroll",
    () => {
        if (!scrollAnimationPending) {
            scrollAnimationPending = true;

            requestAnimationFrame(updateScrollTransformation);
        }
    },
    { passive: true }
);

window.addEventListener(
    "resize",
    updateScrollTransformation
);

updateScrollTransformation();

console.log("Cinematic scroll transitions initialized.");
/* ==========================================
   MAGIC SCROLL TRANSITIONS
========================================== */

(() => {
    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
        document.querySelectorAll(
            ".hero, .about-section, .skills-section, " +
            ".projects-section, .education-section, .contact-section"
        ).forEach(section => {
            section.style.opacity = "1";
        });

        return;
    }

    // Create magical transition layers automatically.

    const portal = document.createElement("div");
    portal.className = "magic-portal";
    document.body.appendChild(portal);

    const flash = document.createElement("div");
    flash.className = "magic-flash";
    document.body.appendChild(flash);

    // Find all page sections.

    const sections = document.querySelectorAll(
        ".hero, .about-section, .skills-section, " +
        ".projects-section, .education-section, .contact-section"
    );

    // Reveal section content when it enters the viewport.

    const revealElements = document.querySelectorAll(
        ".section-heading, .about-grid, .skills-grid, " +
        ".projects-grid, .timeline, .contact-card"
    );

    revealElements.forEach(element => {
        element.classList.add("magic-reveal");
    });

    const revealObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("magic-visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12
        }
    );

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // Add a magical transition when moving between sections.

    let previousSection = -1;
    let isAnimating = false;
    let scrollTimeout;

    function detectSection() {
        const viewportCenter = window.innerHeight * 0.5;

        let activeSection = -1;
        let closestDistance = Infinity;

        sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();

            if (
                rect.top <= viewportCenter &&
                rect.bottom >= viewportCenter
            ) {
                const distance = Math.abs(
                    (rect.top + rect.bottom) / 2 - viewportCenter
                );

                if (distance < closestDistance) {
                    closestDistance = distance;
                    activeSection = index;
                }
            }
        });

        if (
            activeSection !== -1 &&
            previousSection !== -1 &&
            activeSection !== previousSection &&
            !isAnimating
        ) {
            playMagicTransition();
        }

        if (activeSection !== -1) {
            previousSection = activeSection;
        }
    }

    function playMagicTransition() {
        isAnimating = true;

        portal.classList.remove("magic-portal-active");
        flash.classList.remove("magic-flash-active");

        // Restart the CSS animations.

        void portal.offsetWidth;
        void flash.offsetWidth;

        portal.classList.add("magic-portal-active");
        flash.classList.add("magic-flash-active");

        window.setTimeout(() => {
            portal.classList.remove("magic-portal-active");
            flash.classList.remove("magic-flash-active");
            isAnimating = false;
        }, 700);
    }

    window.addEventListener(
        "scroll",
        () => {
            window.clearTimeout(scrollTimeout);

            window.requestAnimationFrame(detectSection);

            scrollTimeout = window.setTimeout(() => {
                detectSection();
            }, 100);
        },
        { passive: true }
    );

    // Give the first section an initial state.

    detectSection();

    console.log("Magic scroll transitions activated!");
})();