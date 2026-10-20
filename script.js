// ==========================================
// 1. ELEMENT SELECTORS
// ==========================================
const preloader = document.getElementById("preloader");
const loader = document.getElementById("loader");
const loaderValue = document.getElementById("loaderValue");
const storyPortal = document.getElementById("storyPortal");

// ==========================================
// 2. MOBILE HAMBURGER MENU
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });

    const links = navLinks.querySelectorAll("a");
    links.forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
      });
    });
  }
});

// ==========================================
// 3. PRELOADER ANIMATION (Safe Check)
// ==========================================
// This IF statement checks if the preloader exists. 
// If you are on works.html (no preloader), it skips this and prevents the crash!
if (preloader && loader && loaderValue) {
  document.body.classList.add("is-loading");
  let progress = 0;

  const loadingAnimation = setInterval(() => {
    progress += Math.floor(Math.random() * 8) + 3;

    if (progress >= 100) {
      progress = 100;
      clearInterval(loadingAnimation);

      setTimeout(() => {
        loader.classList.add("is-leaving");
      }, 120);

      setTimeout(() => {
        preloader.classList.add("is-hidden");
        document.body.classList.remove("is-loading");
        document.body.classList.add("site-ready");
        startScrollAnimations();
      }, 900);
    }

    loaderValue.textContent = progress;
  }, 110);
} else {
  // If no preloader (like on works.html), just show the website immediately
  document.body.classList.remove("is-loading");
  document.body.classList.add("site-ready");
  startScrollAnimations();
}

// ==========================================
// 4. 3D MOUSE TILT EFFECT
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
// 5. SCROLL ANIMATIONS
// ==========================================
function startScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    ".process-card, .sample-card, .offer-card, .section-heading, .about-card, .stat-box, .faq-item"
  );

  animatedElements.forEach((element) => {
    element.classList.add("scroll-reveal");
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
  );

  animatedElements.forEach((element) => observer.observe(element));
}

// ==========================================
// 6. BUTTON TAP EFFECT
// ==========================================
document.querySelectorAll(".button, .nav-contact, .nav-links a").forEach((button) => {
  button.addEventListener("pointerdown", () => button.classList.add("is-pressed"));
  button.addEventListener("pointerup", () => button.classList.remove("is-pressed"));
  button.addEventListener("pointerleave", () => button.classList.remove("is-pressed"));
});

// ==========================================
// 7. IN-APP SECRET ADMIN PANEL (LOCAL STORAGE)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  const openAdminBtn = document.getElementById("openAdmin");
  const adminPanel = document.getElementById("adminPanel");
  const addArticleForm = document.getElementById("addArticleForm");
  const worksGrid = document.getElementById("worksGrid");
  const adminMessage = document.getElementById("adminMessage");

  if (openAdminBtn && adminPanel) {
    openAdminBtn.addEventListener("click", () => {
      adminPanel.style.display = adminPanel.style.display === "none" ? "block" : "none";
    });
  }

  const savedArticles = JSON.parse(localStorage.getItem("flareno_articles")) || [];
  savedArticles.forEach(article => renderArticle(article));

  if (addArticleForm) {
    addArticleForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const newArticle = {
        category: document.getElementById("newCategory").value,
        title: document.getElementById("newTitle").value,
        desc: document.getElementById("newDesc").value,
        link: document.getElementById("newLink").value
      };

      savedArticles.push(newArticle);
      localStorage.setItem("flareno_articles", JSON.stringify(savedArticles));

      renderArticle(newArticle);

      addArticleForm.reset();
      adminMessage.textContent = "Article added to this browser!";
    });
  }

  function renderArticle(article) {
    const a = document.createElement("a");
    a.className = "sample-card scroll-reveal is-visible";
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
