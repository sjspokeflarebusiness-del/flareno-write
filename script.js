const preloader = document.getElementById("preloader");
const loader = document.getElementById("loader");
const loaderValue = document.getElementById("loaderValue");
const storyPortal = document.getElementById("storyPortal");

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

/* Mouse-only 3D tilt. Phones skip this and use the floating CSS animation instead. */
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

/* Makes sections rise in as the visitor scrolls on desktop and phone. */
function startScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    ".process-card, .sample-card, .offer-card, .section-heading"
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
    {
      threshold: 0.12,
      rootMargin: "0px 0px -30px 0px"
    }
  );

  animatedElements.forEach((element) => observer.observe(element));
}

/* Adds a quick satisfying movement when any website button is tapped. */
document.querySelectorAll(".button, .nav-contact").forEach((button) => {
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