// ==========================================================================
// Nav drawer
// ==========================================================================
(function () {
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("siteNav");
  const overlay = document.getElementById("navOverlay");

  if (!toggle || !nav || !overlay) return;

  function openNav() {
    nav.classList.add("is-open");
    overlay.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
    const firstLink = nav.querySelector("a");
    if (firstLink) firstLink.focus();
  }

  function closeNav() {
    nav.classList.remove("is-open");
    overlay.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    isOpen ? closeNav() : openNav();
  });

  overlay.addEventListener("click", closeNav);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });
})();

// ==========================================================================
// Sliders — homepage hero carousel + any gallery photo carousels.
// Initializes every .slider on the page independently (each gets its own
// state via closure), rather than assuming a single instance by ID.
// ==========================================================================
(function () {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function initSlider(slider) {
    const track = slider.querySelector(".slider-track");
    const arrows = slider.querySelectorAll(".slider-arrow");
    const dotsWrap = slider.nextElementSibling;

    if (
      !track ||
      arrows.length < 2 ||
      !dotsWrap ||
      !dotsWrap.classList.contains("slider-dots")
    ) {
      return;
    }

    const [prevBtn, nextBtn] = arrows;
    const slides = Array.from(track.children);

    // Nothing to slide — drop the controls rather than leave dead buttons.
    if (slides.length < 2) {
      const controls = slider.querySelector(".slider-controls");
      if (controls) controls.remove();
      dotsWrap.remove();
      return;
    }

    let current = 0;
    let autoplayTimer = null;

    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
      if (i === 0) dot.setAttribute("aria-current", "true");
      dot.addEventListener("click", () => goTo(i, true));
      dotsWrap.appendChild(dot);
    });

    const dots = Array.from(dotsWrap.children);

    function goTo(index, userInitiated) {
      current = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) =>
        i === current
          ? d.setAttribute("aria-current", "true")
          : d.removeAttribute("aria-current")
      );
      if (userInitiated) restartAutoplay();
    }

    function next() {
      goTo(current + 1);
    }

    function prev() {
      goTo(current - 1);
    }

    prevBtn.addEventListener("click", () => {
      prev();
      restartAutoplay();
    });
    nextBtn.addEventListener("click", () => {
      next();
      restartAutoplay();
    });

    function startAutoplay() {
      if (prefersReducedMotion) return;
      autoplayTimer = setInterval(next, 5000);
    }

    function stopAutoplay() {
      if (autoplayTimer) clearInterval(autoplayTimer);
    }

    function restartAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    slider.addEventListener("mouseenter", stopAutoplay);
    slider.addEventListener("mouseleave", startAutoplay);
    slider.addEventListener("focusin", stopAutoplay);
    slider.addEventListener("focusout", startAutoplay);

    startAutoplay();
  }

  document.querySelectorAll(".slider").forEach(initSlider);
})();

// Footer year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ==========================================================================
// Contact form — toast confirmation
// ==========================================================================
(function () {
  const toast = document.getElementById("formStatus");
  const text = document.getElementById("formStatusText");
  const closeBtn = document.getElementById("formStatusClose");
  if (!toast || !text || !closeBtn) return;

  let dismissTimer = null;

  function showToast(message) {
    text.textContent = message;
    toast.classList.add("is-visible");
    if (dismissTimer) clearTimeout(dismissTimer);
    dismissTimer = setTimeout(hideToast, 6000);
  }

  function hideToast() {
    toast.classList.remove("is-visible");
    if (dismissTimer) clearTimeout(dismissTimer);
  }

  closeBtn.addEventListener("click", hideToast);

  if (new URLSearchParams(window.location.search).get("sent") === "1") {
    showToast("Thanks — your message has been sent. I'll get back to you soon.");
    window.history.replaceState({}, "", window.location.pathname);
  }
})();

// ==========================================================================
// Scroll reveal — card shells only, never the prose inside them
// ==========================================================================
(function () {
  const items = document.querySelectorAll(
    ".gallery-card, .project-card, .resume-card"
  );
  if (!items.length) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // No IntersectionObserver, or reduced motion: just show everything, skip
  // the entrance rather than leaving content stuck at opacity: 0.
  if (!("IntersectionObserver" in window) || prefersReducedMotion) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((el) => observer.observe(el));
})();

// ==========================================================================
// Lightbox — click (or press Enter/Space on) any gallery image to view it
// full size. Only wires up on pages that include the #lightbox markup.
// ==========================================================================
(function () {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;

  const lightboxImage = document.getElementById("lightboxImage");
  const closeBtn = document.getElementById("lightboxClose");
  let lastFocused = null;

  function isGalleryImage(el) {
    return el && el.tagName === "IMG" && el.closest(".gallery-card");
  }

  function open(img) {
    lastFocused = document.activeElement;
    lightboxImage.src = img.currentSrc || img.src;
    lightboxImage.alt = img.alt || "";
    lightbox.classList.add("is-open");
    document.body.classList.add("no-scroll");
    closeBtn.focus();
  }

  function close() {
    lightbox.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    lightboxImage.src = "";
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  }

  document.addEventListener("click", (e) => {
    if (isGalleryImage(e.target)) {
      open(e.target);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (lightbox.classList.contains("is-open") && e.key === "Escape") {
      close();
      return;
    }
    if (
      (e.key === "Enter" || e.key === " ") &&
      isGalleryImage(e.target)
    ) {
      e.preventDefault();
      open(e.target);
    }
  });

  closeBtn.addEventListener("click", close);

  // Click the dark backdrop (not the image itself) to dismiss.
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });
})();
