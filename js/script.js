"use strict";

/* ══════════════════════════════════════════════
   1. PAGE LOADER
══════════════════════════════════════════════ */
(function initLoader() {
  const loader = document.getElementById("page-loader");
  const bar = loader.querySelector(".loader-bar");
  const pctEl = loader.querySelector(".loader-pct");
  let progress = 0;
  let raf;

  function tick() {
    // Accelerate to ~90 fast, then slow down for realism
    const increment =
      progress < 60
        ? Math.random() * 14 + 6
        : progress < 85
          ? Math.random() * 5 + 2
          : Math.random() * 1.5;

    progress = Math.min(progress + increment, 100);
    bar.style.width = progress + "%";
    pctEl.textContent = Math.round(progress) + "%";

    if (progress < 100) {
      raf = setTimeout(tick, 60 + Math.random() * 40);
    } else {
      // Delay hide for visual polish
      setTimeout(() => {
        loader.classList.add("hidden");
        document.body.style.overflow = "";
      }, 350);
    }
  }

  // Prevent scroll during load
  document.body.style.overflow = "hidden";
  setTimeout(tick, 150);
})();

/* ══════════════════════════════════════════════
   2. NAVBAR — scroll glass + active spy
══════════════════════════════════════════════ */
(function initNavbar() {
  const navbar = document.getElementById("navbar");
  const navLinks = document.querySelectorAll(".nav-link");

  // Scroll glass effect
  const onScroll = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 30);
  };
  window.addEventListener("scroll", onScroll, { passive: true });

  // Smooth scroll on nav link click
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      const offset =
        parseInt(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--nav-h",
          ),
        ) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  // Active link spy using IntersectionObserver
  const sectionIds = [
    "hero",
    "about",
    "skills",
    "projects",
    "services",
    "contact",
  ];
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.toggle(
              "active",
              link.dataset.section === entry.target.id,
            );
          });
        }
      });
    },
    { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
  );

  sections.forEach((s) => spy.observe(s));
})();

/* ══════════════════════════════════════════════
   3. MOBILE HAMBURGER
══════════════════════════════════════════════ */
(function initHamburger() {
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobile-nav");

  function toggleMenu(force) {
    const open =
      force !== undefined ? force : !hamburger.classList.contains("open");
    hamburger.classList.toggle("open", open);
    hamburger.setAttribute("aria-expanded", open);
    mobileNav.classList.toggle("open", open);
    mobileNav.setAttribute("aria-hidden", !open);
  }

  hamburger.addEventListener("click", () => toggleMenu());

  // Close on mobile link click
  mobileNav.querySelectorAll(".mobile-link").forEach((link) => {
    link.addEventListener("click", () => toggleMenu(false));
  });

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
      toggleMenu(false);
    }
  });
})();

/* ══════════════════════════════════════════════
   4. TYPEWRITER EFFECT
══════════════════════════════════════════════ */
(function initTypewriter() {
  const el = document.getElementById("typewriter");
  if (!el) return;

  const words = [
    "JavaScript Specialist",
    "React Developer",
    "UI Engineer",
    "Performance Expert",
    "Component Architect",
  ];

  let wordIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let isPaused = false;

  const TYPE_SPEED = 75;
  const DELETE_SPEED = 40;
  const PAUSE_MS = 1900;

  function type() {
    const current = words[wordIdx];

    if (!isDeleting) {
      // Typing forward
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;

      if (charIdx === current.length) {
        // Finished word — pause before deleting
        isPaused = true;
        setTimeout(() => {
          isPaused = false;
          isDeleting = true;
          type();
        }, PAUSE_MS);
        return;
      }
    } else {
      // Deleting
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;

      if (charIdx === 0) {
        isDeleting = false;
        wordIdx = (wordIdx + 1) % words.length;
      }
    }

    const speed = isDeleting ? DELETE_SPEED : TYPE_SPEED;
    setTimeout(type, speed);
  }

  // Start with small delay after load
  setTimeout(type, 1200);
})();

/* ══════════════════════════════════════════════
   5. INTERSECTION OBSERVER — SCROLL ANIMATIONS
══════════════════════════════════════════════ */
(function initScrollAnimations() {
  const animElements = document.querySelectorAll(".animate-on-scroll");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Respect animation-delay if set inline
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: "0px 0px -60px 0px",
      threshold: 0.1,
    },
  );

  animElements.forEach((el) => observer.observe(el));
})();

/* ══════════════════════════════════════════════
   6. SKILL BARS — animate when visible
══════════════════════════════════════════════ */
(function initSkillBars() {
  const bars = document.querySelectorAll(".skill-bar");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const width = bar.dataset.width;
          // Small delay for stagger effect relative to card
          const delay =
            Array.from(
              bar.closest(".skill-bars").querySelectorAll(".skill-bar"),
            ).indexOf(bar) * 80;
          setTimeout(() => {
            bar.style.width = width + "%";
          }, delay);
          observer.unobserve(bar);
        }
      });
    },
    { threshold: 0.3 },
  );

  bars.forEach((bar) => observer.observe(bar));
})();

/* ══════════════════════════════════════════════
   7. COUNTER ANIMATIONS
══════════════════════════════════════════════ */
(function initCounters() {
  const counters = document.querySelectorAll(".stat-number[data-count]");

  const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

  function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    const duration = 1400;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(easeOutQuart(progress) * target);
      el.textContent = value;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );

  counters.forEach((c) => observer.observe(c));
})();

/* ══════════════════════════════════════════════
   8. PROJECT FILTER
══════════════════════════════════════════════ */
(function initProjectFilter() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".project-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const filter = this.dataset.filter;

      // Update active state
      filterBtns.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      this.classList.add("active");
      this.setAttribute("aria-selected", "true");

      // Filter cards with fade
      cards.forEach((card) => {
        const category = card.dataset.category || "";
        const matches = filter === "all" || category.includes(filter);

        if (matches) {
          card.classList.remove("hidden");
          // Stagger re-entrance
          card.style.animation = "none";
          card.offsetHeight; // trigger reflow
          card.style.animation = "";
          requestAnimationFrame(() => {
            card.style.opacity = "0";
            card.style.transform = "translateY(20px) scale(0.97)";
            card.style.transition = "opacity 0.35s ease, transform 0.35s ease";
            requestAnimationFrame(() => {
              card.style.opacity = "1";
              card.style.transform = "translateY(0) scale(1)";
            });
          });
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });
})();

/* ══════════════════════════════════════════════
   9. CONTACT FORM VALIDATION + SUBMIT
══════════════════════════════════════════════ */
(function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const submitBtn = document.getElementById("submit-btn");
  const successMsg = document.getElementById("form-success");
  const btnText = submitBtn.querySelector(".btn-text");
  const btnIcon = submitBtn.querySelector(".btn-icon");
  const btnSpinner = submitBtn.querySelector(".btn-spinner");

  // Live validation helpers
  function getFieldError(name, value) {
    value = value.trim();
    switch (name) {
      case "name":
        if (!value) return "Name is required.";
        if (value.length < 2) return "Name must be at least 2 characters.";
        return "";
      case "email":
        if (!value) return "Email address is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Please enter a valid email.";
        return "";
      case "message":
        if (!value) return "Message is required.";
        if (value.length < 20) return "Message must be at least 20 characters.";
        return "";
      default:
        return "";
    }
  }

  function showError(fieldName, message) {
    const input = form.querySelector(`[name="${fieldName}"]`);
    const error = document.getElementById(`${fieldName}-error`);
    if (input) input.classList.toggle("error", !!message);
    if (error) error.textContent = message;
  }

  function clearError(fieldName) {
    showError(fieldName, "");
  }

  // Live validation on blur
  ["name", "email", "message"].forEach((name) => {
    const input = form.querySelector(`[name="${name}"]`);
    if (!input) return;
    input.addEventListener("blur", () => {
      showError(name, getFieldError(name, input.value));
    });
    input.addEventListener("input", () => {
      if (input.classList.contains("error")) {
        showError(name, getFieldError(name, input.value));
      }
    });
  });

  // Submit
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Validate all required fields
    const fields = ["name", "email", "message"];
    let hasError = false;

    fields.forEach((name) => {
      const input = form.querySelector(`[name="${name}"]`);
      const err = getFieldError(name, input ? input.value : "");
      showError(name, err);
      if (err) hasError = true;
    });

    if (hasError) {
      // Shake animation on form
      form.style.animation = "none";
      form.offsetHeight;
      form.style.animation = "shake 0.4s ease";
      return;
    }

    // Show loading state
    submitBtn.disabled = true;
    btnText.textContent = "Sending…";
    btnIcon.hidden = true;
    btnSpinner.hidden = false;

    // Simulate API call (replace with real fetch in production)
    await new Promise((resolve) => setTimeout(resolve, 1800));

    // Success state
    btnText.textContent = "Message Sent!";
    btnIcon.hidden = false;
    btnSpinner.hidden = true;
    btnIcon.innerHTML =
      '<svg viewBox="0 0 20 20" fill="none" width="16" height="16"><path d="M4 10l4.5 4.5L16 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    submitBtn.style.background = "rgba(0,229,176,0.15)";
    submitBtn.style.borderColor = "rgba(0,229,176,0.4)";

    // Show success message
    successMsg.hidden = false;
    successMsg.style.animation = "fadeUp 0.5s ease both";

    // Reset after delay
    setTimeout(() => {
      form.reset();
      submitBtn.disabled = false;
      btnText.textContent = "Send Message";
      btnIcon.innerHTML =
        '<svg viewBox="0 0 20 20" fill="none" width="16" height="16"><path d="M3 10h14M11 4l6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      submitBtn.style.background = "";
      submitBtn.style.borderColor = "";
      successMsg.hidden = true;
      fields.forEach((n) => clearError(n));
    }, 5000);
  });
})();

/* ══════════════════════════════════════════════
   10. MISC UTILITIES
══════════════════════════════════════════════ */
(function initMisc() {
  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Add shake keyframes dynamically
  const style = document.createElement("style");
  style.textContent = `
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      20%      { transform: translateX(-6px); }
      40%      { transform: translateX(6px); }
      60%      { transform: translateX(-4px); }
      80%      { transform: translateX(4px); }
    }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);

  // Keyboard accessibility — close mobile nav on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const hamburger = document.getElementById("hamburger");
      const mobileNav = document.getElementById("mobile-nav");
      if (hamburger.classList.contains("open")) {
        hamburger.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
        mobileNav.classList.remove("open");
        mobileNav.setAttribute("aria-hidden", "true");
      }
    }
  });

  // Subtle parallax on hero shapes (performance-safe: only when idle)
  const shapes = document.querySelectorAll(".shape");
  let ticking = false;

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        shapes.forEach((shape, i) => {
          const speed = (i + 1) * 0.12;
          shape.style.transform = `translateY(${y * speed}px)`;
        });
        ticking = false;
      });
      ticking = true;
    },
    { passive: true },
  );
})();

/* ══════════════════════════════════════════════
   HERO SECTION — ensure scroll to section works
══════════════════════════════════════════════ */
document.querySelectorAll('[href="#projects"]').forEach((el) => {
  el.addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  });
});
