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
// ==========================================
// 7. IN-APP SECRET ADMIN PANEL (LOCAL STORAGE)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  const openAdminBtn = document.getElementById("openAdmin");
  const adminPanel = document.getElementById("adminPanel");
  const adminPass = document.getElementById("adminPass");
  const articleFields = document.getElementById("articleFields");
  const addArticleForm = document.getElementById("addArticleForm");
  const worksGrid = document.getElementById("worksGrid");
  const adminMessage = document.getElementById("adminMessage");

  const SECRET_PASSWORD = "flareno123"; // <-- CHANGE THIS TO YOUR OWN PASSWORD

  // 1. Open the panel when the tiny dot is clicked
  if (openAdminBtn) {
    openAdminBtn.addEventListener("click", () => {
      adminPanel.style.display = adminPanel.style.display === "none" ? "block" : "none";
    });
  }

  // 2. Check password
  if (adminPass) {
    adminPass.addEventListener("input", (e) => {
      if (e.target.value === SECRET_PASSWORD) {
        articleFields.style.display = "grid";
        adminMessage.textContent = "Password Correct! You can add articles now.";
        adminMessage.style.color = "#8ee9ba";
      } else {
        articleFields.style.display = "none";
        adminMessage.textContent = "";
      }
    });
  }

  // 3. Load saved articles from LocalStorage when the page loads
  const savedArticles = JSON.parse(localStorage.getItem("flareno_articles")) || [];
  savedArticles.forEach(article => renderArticle(article));

  // 4. Add new article
  if (addArticleForm) {
    addArticleForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const newArticle = {
        category: document.getElementById("newCategory").value,
        title: document.getElementById("newTitle").value,
        desc: document.getElementById("newDesc").value,
        link: document.getElementById("newLink").value
      };

      // Save to LocalStorage
      savedArticles.push(newArticle);
      localStorage.setItem("flareno_articles", JSON.stringify(savedArticles));

      // Render it instantly on the page
      renderArticle(newArticle);

      // Reset form
      addArticleForm.reset();
      articleFields.style.display = "none";
      adminMessage.textContent = "Article added successfully!";
    });
  }

  // 5. Function to create the HTML for the article
  function renderArticle(article) {
    const a = document.createElement("a");
    a.className = "sample-card scroll-reveal is-visible"; // Added animation classes
    a.href = article.link;
    a.target = "_blank";
    
    a.innerHTML = `
      <span>${article.category}</span>
      <h3>${article.title}</h3>
      <p>${article.desc}</p>
    `;
    
    worksGrid.appendChild(a);
  }
});
