// ==========================================
// 1. ELEMENT SELECTORS
// ==========================================
const preloader = document.getElementById("preloader");
const loader = document.getElementById("loader");
const loaderValue = document.getElementById("loaderValue");
const storyPortal = document.getElementById("storyPortal");

// Add loading class to body to prevent scrolling while preloader is active
document.body.classList.add("is-loading");

// ==========================================
// 2. MOBILE HAMBURGER MENU
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");

  if (hamburger && navLinks) {
    // Toggle menu on button click
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });

    // Auto-close menu when a link is clicked (good for mobile UX)
    const links = navLinks.querySelectorAll("a");
    links.forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
      });
    });
  }
});

// ==========================================
// 3. PRELOADER ANIMATION
// ==========================================
let progress = 0;

const loadingAnimation = setInterval(() => {
  progress += Math.floor(Math.random() * 8) + 3;

  if (progress >= 100) {
    progress = 100;
    clearInterval(loadingAnimation);

    // Start the exit animation
    setTimeout(() => {
      loader.classList.add("is-leaving");
    }, 120);

    // Hide preloader and start website animations
    setTimeout(() => {
      preloader.classList.add("is-hidden");
      document.body.classList.remove("is-loading");
      document.body.classList.add("site-ready");
      startScrollAnimations();
    }, 900);
  }

  loaderValue.textContent = progress;
}, 110); // Adjust this number (110) to make preloader faster/slower

// ==========================================
// 4. 3D MOUSE TILT EFFECT (Desktop Only)
// ==========================================
if (storyPortal && window.matchMedia("(pointer: fine)").matches) {
  storyPortal.addEventListener("mousemove", (event) => {
    const box = storyPortal.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;

    storyPortal.style.transform = 
      `perspective(1000px) rotateX(${y * -8}deg) rotateY(${x * 10}deg) translateY(-6px)`;
  });

  storyPortal.addEventListener("mouseleave", () => {
    storyPortal.style.transform = 
      "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
  });
}

// ==========================================
// 5. SCROLL ANIMATIONS (Fade in up)
// ==========================================
function startScrollAnimations() {
  // Select all elements you want to animate on scroll
  const animatedElements = document.querySelectorAll(
    ".process-card, .sample-card, .offer-card, .section-heading, .about-card, .stat-box, .faq-item"
  );

  // Add the base scroll-reveal class to them
  animatedElements.forEach((element) => {
    element.classList.add("scroll-reveal");
  });

  // Set up the Intersection Observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target); // Stop observing once visible
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -30px 0px"
    }
  );

  // Tell the observer to watch the elements
  animatedElements.forEach((element) => observer.observe(element));
}

// ==========================================
// 6. BUTTON TAP EFFECT
// ==========================================
document.querySelectorAll(".button, .nav-contact, .nav-links a").forEach((button) => {
  button.addEventListener("pointerdown", () => {
    button.classList.add("is-pressed");
  });

  button.addEventListener("pointerup", () => {
    button.classList.remove("is-pressed");
  });

  button.addEventListener("pointerleave", () => {
    button.classList.remove("is-pressed");
  });
});
