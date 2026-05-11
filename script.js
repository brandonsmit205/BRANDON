const pageLoader = document.querySelector(".page-loader");
const siteHeader = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = [...document.querySelectorAll(".nav-menu a")];
const sectionLinks = navLinks.filter((link) => link.getAttribute("href")?.startsWith("#"));
const scrollTopButton = document.querySelector(".scroll-top");
const counters = document.querySelectorAll(".counter");
const revealItems = document.querySelectorAll(".reveal");
const faqItems = document.querySelectorAll(".faq-item");
const contactForm = document.getElementById("contact-form");
const formNote = document.getElementById("form-note");
const yearEl = document.getElementById("year");
const sections = [...document.querySelectorAll("main section[id]")];
const labTabs = [...document.querySelectorAll(".lab-tab")];
const labPanels = [...document.querySelectorAll(".lab-panel")];
const interactiveCards = document.querySelectorAll(
  ".showcase-card, .logos-card, .lab-shell, .lab-visual, .service-card, .price-card, .portfolio-card, .process-feature, .process-step, .benefit-card, .testimonial-card, .stat-card, .cta-banner, .cta-panel, .contact-card, .contact-form-wrap, .map-card, .faq-item, .why-intro-panel"
);
const showcaseCard = document.querySelector(".showcase-card");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

const formatCounterValue = (value) => Math.round(value);

const animateCounter = (counter) => {
  const target = Number(counter.dataset.target || 0);
  const duration = 1500;
  const startTime = performance.now();

  const update = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    counter.textContent = formatCounterValue(target * eased);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  };

  requestAnimationFrame(update);
};

const counterObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    }

    const counter = entry.target;
    if (!counter.dataset.counted) {
      counter.dataset.counted = "true";
      animateCounter(counter);
    }

    observer.unobserve(counter);
  });
}, { threshold: 0.45 });

counters.forEach((counter) => counterObserver.observe(counter));

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    }

    entry.target.classList.add("is-visible");
    observer.unobserve(entry.target);
  });
}, { threshold: 0.16 });

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 40, 220)}ms`;
  revealObserver.observe(item);
});

const setActiveNavLink = (id) => {
  sectionLinks.forEach((link) => {
    const matches = link.getAttribute("href") === `#${id}`;
    link.classList.toggle("is-active", matches);
  });
};

if (sections.length > 0) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visibleEntry = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visibleEntry?.target?.id) {
      setActiveNavLink(visibleEntry.target.id);
    }
  }, {
    rootMargin: "-38% 0px -42% 0px",
    threshold: [0.15, 0.35, 0.55],
  });

  sections.forEach((section) => sectionObserver.observe(section));
}

const updateShowcaseRestingTransform = () => {
  if (!showcaseCard) {
    return;
  }

  showcaseCard.style.transform = window.innerWidth > 1100 ? "rotateX(7deg) rotateY(-9deg)" : "none";
};

const handleScroll = () => {
  const offset = window.scrollY;
  siteHeader?.classList.toggle("scrolled", offset > 24);
  scrollTopButton?.classList.toggle("is-visible", offset > 520);
};

handleScroll();
updateShowcaseRestingTransform();

window.addEventListener("resize", updateShowcaseRestingTransform);
window.addEventListener("scroll", handleScroll, { passive: true });

navToggle?.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

scrollTopButton?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

faqItems.forEach((item) => {
  const question = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");

  question?.addEventListener("click", () => {
    const isOpen = item.classList.contains("is-open");

    faqItems.forEach((faq) => {
      faq.classList.remove("is-open");
      const faqQuestion = faq.querySelector(".faq-question");
      const faqAnswer = faq.querySelector(".faq-answer");
      faqQuestion?.setAttribute("aria-expanded", "false");

      if (faqAnswer) {
        faqAnswer.style.maxHeight = null;
      }
    });

    if (isOpen) {
      return;
    }

    item.classList.add("is-open");
    question.setAttribute("aria-expanded", "true");

    if (answer) {
      answer.style.maxHeight = `${answer.scrollHeight}px`;
    }
  });
});

const activateLabPanel = (panelName) => {
  labTabs.forEach((tab) => {
    const isActive = tab.dataset.panel === panelName;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
    tab.tabIndex = isActive ? 0 : -1;
  });

  labPanels.forEach((panel) => {
    const isActive = panel.dataset.panel === panelName;
    panel.classList.toggle("is-active", isActive);
    panel.hidden = !isActive;
  });
};

labTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => {
    activateLabPanel(tab.dataset.panel);
  });

  tab.addEventListener("keydown", (event) => {
    const key = event.key;
    if (key !== "ArrowRight" && key !== "ArrowLeft" && key !== "Home" && key !== "End") {
      return;
    }

    event.preventDefault();

    let nextIndex = index;
    if (key === "ArrowRight") {
      nextIndex = (index + 1) % labTabs.length;
    } else if (key === "ArrowLeft") {
      nextIndex = (index - 1 + labTabs.length) % labTabs.length;
    } else if (key === "Home") {
      nextIndex = 0;
    } else if (key === "End") {
      nextIndex = labTabs.length - 1;
    }

    const nextTab = labTabs[nextIndex];
    activateLabPanel(nextTab.dataset.panel);
    nextTab.focus();
  });
});

if (labTabs.length > 0) {
  const defaultTab = labTabs.find((tab) => tab.classList.contains("is-active")) || labTabs[0];
  activateLabPanel(defaultTab.dataset.panel);
}

if (finePointer.matches) {
  interactiveCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;

      card.style.setProperty("--pointer-x", `${x}%`);
      card.style.setProperty("--pointer-y", `${y}%`);

      if (card === showcaseCard && window.innerWidth > 1100) {
        const rotateY = ((x - 50) / 50) * 7;
        const rotateX = ((50 - y) / 50) * 6;
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      }
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--pointer-x", "50%");
      card.style.setProperty("--pointer-y", "50%");

      if (card === showcaseCard) {
        updateShowcaseRestingTransform();
      }
    });
  });
}

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("name")?.value?.trim() || "there";

  formNote.textContent = `Thanks ${name}, your request is ready. Replace this demo form with your preferred email or backend integration when you go live.`;
  formNote.style.color = "#9df3cf";
  contactForm.reset();
});

const hideLoader = () => {
  pageLoader?.classList.add("is-hidden");
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", hideLoader, { once: true });
} else {
  hideLoader();
}

if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}
