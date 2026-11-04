// Set this to a monitored email address before publishing so the contact form can open a ready-to-send email.
const CONTACT_EMAIL = "";

const quizQuestions = [
  {
    label: "YOUR SPACE",
    title: "Where will solar make a difference?",
    subtitle: "Choose the space you’re thinking about.",
    options: [
      { value: "home", label: "A house or home", icon: "⌂" },
      { value: "business", label: "A shop or business", icon: "↗" },
      { value: "other", label: "Somewhere else", icon: "✳" }
    ]
  },
  {
    label: "YOUR PRIORITY",
    title: "What matters most to you?",
    subtitle: "Pick the closest fit for now.",
    options: [
      { value: "essentials", label: "Keep the essentials on", icon: "01" },
      { value: "comfort", label: "More everyday comfort", icon: "02" },
      { value: "continuity", label: "Keep work moving", icon: "03" },
      { value: "independence", label: "More energy independence", icon: "04" }
    ]
  },
  {
    label: "YOUR BACKUP",
    title: "How much backup sounds right?",
    subtitle: "It’s okay if you’re not sure yet.",
    options: [
      { value: "day", label: "Mostly daytime use", icon: "☼" },
      { value: "short", label: "A few key hours", icon: "◷" },
      { value: "long", label: "Longer outages too", icon: "◴" },
      { value: "unsure", label: "Help me figure it out", icon: "?" }
    ]
  }
];

const quizAnswers = [];
let currentQuestion = 0;
const quizContent = document.querySelector(".quiz-content");
const quizNext = document.querySelector(".quiz-next");
const quizBack = document.querySelector(".quiz-back");
const stepLabel = document.querySelector(".quiz-step-label");
const stepCount = document.querySelector(".quiz-step-count");
const progressFill = document.querySelector(".progress-fill");
const quizHint = document.querySelector(".quiz-hint");

function renderQuestion() {
  const question = quizQuestions[currentQuestion];
  stepLabel.textContent = question.label;
  stepCount.textContent = `0${currentQuestion + 1} / 03`;
  progressFill.style.width = `${((currentQuestion + 1) / quizQuestions.length) * 100}%`;
  quizBack.hidden = currentQuestion === 0;
  quizNext.hidden = false;
  quizNext.disabled = !quizAnswers[currentQuestion];
  quizNext.innerHTML = `${currentQuestion === quizQuestions.length - 1 ? "See my starting point" : "Continue"} <span aria-hidden="true">→</span>`;
  quizHint.textContent = "ABOUT 30 SECONDS";
  quizContent.innerHTML = `
    <h3 class="quiz-question">${question.title}</h3>
    <p class="quiz-subtitle">${question.subtitle}</p>
    <div class="quiz-options">
      ${question.options.map(option => `
        <button class="quiz-option${quizAnswers[currentQuestion] === option.value ? " selected" : ""}" type="button" data-value="${option.value}" aria-pressed="${quizAnswers[currentQuestion] === option.value}">
          ${option.label}<span aria-hidden="true">${option.icon}</span>
        </button>
      `).join("")}
    </div>`;
  quizContent.querySelectorAll(".quiz-option").forEach(option => {
    option.addEventListener("click", () => {
      quizAnswers[currentQuestion] = option.dataset.value;
      quizContent.querySelectorAll(".quiz-option").forEach(item => {
        const selected = item === option;
        item.classList.toggle("selected", selected);
        item.setAttribute("aria-pressed", String(selected));
      });
      quizNext.disabled = false;
    });
  });
}

function showResult() {
  const [space, priority, backup] = quizAnswers;
  let result;
  if (space === "business" || priority === "continuity") {
    result = {
      title: "Business Continuity",
      range: "5 kW+ · site-designed",
      description: "A business setup could be a good place to explore, with the final system shaped around your equipment, operating hours, and backup needs.",
      contactType: "A business solar setup"
    };
  } else if (priority === "essentials" || (space === "home" && backup === "day")) {
    result = {
      title: "Home Essentials",
      range: "1–3 kW · starting direction",
      description: "A focused home system may be worth exploring first. A load assessment will help identify which essentials can be supported and for how long.",
      contactType: "A home solar setup"
    };
  } else {
    result = {
      title: "Home Independence",
      range: "3–5 kW · starting direction",
      description: "A larger home system may be a useful starting conversation for broader daily use. Battery capacity and backup time depend on your actual loads.",
      contactType: "A home solar setup"
    };
  }

  stepLabel.textContent = "YOUR STARTING POINT";
  stepCount.textContent = "03 / 03";
  progressFill.style.width = "100%";
  quizBack.hidden = false;
  quizNext.hidden = true;
  quizHint.textContent = "A FIRST STEP, NOT A FINAL QUOTE";
  quizContent.innerHTML = `
    <div class="quiz-result">
      <p class="result-tag">A BUNDLE TO EXPLORE</p>
      <h3>${result.title}</h3>
      <p>${result.description}</p>
      <div class="result-range">${result.range}</div>
      <a href="#contact" class="result-contact">Talk through this option <span aria-hidden="true">↗</span></a>
      <span class="result-disclaimer">Illustrative only. Final system design requires a site and load assessment.</span>
    </div>`;
  document.querySelector(".result-contact").addEventListener("click", () => {
    document.querySelector("#contact-type").value = result.contactType;
  });
}

quizNext.addEventListener("click", () => {
  if (!quizAnswers[currentQuestion]) return;
  if (currentQuestion < quizQuestions.length - 1) {
    currentQuestion += 1;
    renderQuestion();
  } else {
    showResult();
  }
});

quizBack.addEventListener("click", () => {
  if (currentQuestion === quizQuestions.length - 1 && quizNext.hidden) {
    quizNext.hidden = false;
  } else if (currentQuestion > 0) {
    currentQuestion -= 1;
  }
  renderQuestion();
});

document.querySelectorAll("[data-prefill]").forEach(link => {
  link.addEventListener("click", () => {
    const intendedSpace = link.dataset.prefill;
    quizAnswers[0] = intendedSpace;
    currentQuestion = 0;
    renderQuestion();
    requestAnimationFrame(() => {
      const selected = quizContent.querySelector(".quiz-option.selected");
      if (selected) selected.focus({ preventScroll: true });
    });
  });
});

document.querySelector(".contact-form").addEventListener("submit", event => {
  event.preventDefault();
  const form = event.currentTarget;
  const note = form.querySelector(".form-note");
  if (!CONTACT_EMAIL) {
    note.textContent = "Before publishing, add your contact email in script.js. The form is ready to use once it’s configured.";
    note.setAttribute("role", "alert");
    return;
  }

  const data = new FormData(form);
  const subject = encodeURIComponent("Solar project inquiry");
  const body = encodeURIComponent(
    `Name: ${data.get("name")}\nEmail: ${data.get("email")}\nLooking for: ${data.get("type")}\n\nProject details:\n${data.get("message") || "Not provided"}`
  );
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  note.textContent = "Your email app should open with your project details ready to send.";
  note.setAttribute("role", "status");
});

const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
menuToggle.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  siteNav.classList.toggle("is-open", open);
});
siteNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");
  siteNav.classList.remove("is-open");
}));

document.querySelector("#current-year").textContent = String(new Date().getFullYear());

const revealElements = document.querySelectorAll(
  ".intro-strip .strip-inner, .section-heading, .bundle-card, .bundle-disclaimer, .match-copy, .quiz-card, .step, .payment-orbit, .payment-copy, .payment-decoration, .contact-copy, .contact-form, .site-footer .footer-main, .site-footer .footer-bottom"
);
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
const motionToggle = document.querySelector(".motion-toggle");
const heroPhoto = document.querySelector(".hero-photo");
const heroCopy = document.querySelector(".hero-copy");
const photoLabel = document.querySelector(".photo-label");
const photoCaption = document.querySelector(".photo-caption");
const motionTargets = [
  ...new Set([
    ...revealElements,
    heroCopy,
    photoLabel,
    photoCaption
  ].filter(Boolean))
];
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function getDocumentTop(element) {
  let top = 0;
  let current = element;

  while (current && current !== document.body) {
    top += current.offsetTop;
    current = current.offsetParent;
  }

  return top;
}

let motionMeasurements = [];
let heroMeasurement = null;

function measureScrollTargets() {
  motionMeasurements = motionTargets.map((element, index) => ({
    element,
    index,
    top: getDocumentTop(element),
    height: element.offsetHeight
  }));
  heroMeasurement = heroPhoto
    ? { top: getDocumentTop(heroPhoto), height: heroPhoto.offsetHeight }
    : null;
}

revealElements.forEach((element, index) => {
  element.classList.add("reveal", "scroll-motion");
  if (index % 3 === 0) element.classList.add("reveal-from-left");
  if (index % 3 === 2) element.classList.add("reveal-from-right");
});
motionTargets.forEach(element => element.classList.add("scroll-motion"));

function updateScrollMotion() {
  const viewportHeight = window.innerHeight;
  const scrollY = window.scrollY;

  if (heroPhoto && heroMeasurement) {
    const progress = clamp(
      (scrollY + viewportHeight - heroMeasurement.top) / (viewportHeight + heroMeasurement.height),
      0,
      1
    );
    heroPhoto.style.setProperty("--scroll-parallax-y", `${-10 + progress * 22}%`);
  }

  motionMeasurements.forEach(({ element, index, top, height }) => {
    const progress = clamp(
      (scrollY + viewportHeight - top) / (viewportHeight + height) + (index % 3) * 0.025,
      0,
      1
    );
    const enter = clamp(progress / 0.18, 0, 1);
    const exit = clamp((progress - 0.78) / 0.22, 0, 1);
    const startY = element === heroCopy ? 52 : element === photoLabel ? -22 : element === photoCaption ? 24 : 44;
    const endY = element === heroCopy ? -48 : element === photoLabel ? 30 : element === photoCaption ? -24 : -38;
    const startOpacity = element === photoLabel ? 0.25 : 0;
    const direction = element.classList.contains("reveal-from-left")
      ? -28
      : element.classList.contains("reveal-from-right")
        ? 28
        : 0;
    const y = progress < 0.18 ? startY * (1 - enter) : progress > 0.78 ? endY * exit : 0;
    const opacity = progress < 0.18
      ? startOpacity + (1 - startOpacity) * enter
      : progress > 0.78 ? 1 - exit : 1;
    const scale = 0.97 + 0.03 * enter - 0.015 * exit;

    element.style.setProperty("--scroll-opacity", String(opacity));
    element.style.setProperty("--scroll-x", `${direction * (1 - enter)}px`);
    element.style.setProperty("--scroll-y", `${y}px`);
    element.style.setProperty("--scroll-scale", String(scale));
  });
}

let motionFrame = 0;
let motionOverride = null;
function scheduleScrollMotion() {
  if (motionFrame || !document.body.classList.contains("motion-ready")) return;
  motionFrame = window.requestAnimationFrame(() => {
    motionFrame = 0;
    updateScrollMotion();
  });
}

function setScrollMotionEnabled(enabled) {
  document.documentElement.classList.toggle("motion-enabled", enabled);
  document.documentElement.classList.toggle("motion-disabled", !enabled);
  document.body.classList.toggle("motion-ready", enabled);
  motionToggle.setAttribute("aria-pressed", String(enabled));
  motionToggle.setAttribute("aria-label", enabled
    ? "Disable animations and smooth scrolling"
    : "Enable animations and smooth scrolling");
  motionToggle.textContent = `Motion: ${enabled ? "On" : "Off"}`;
  if (enabled) {
    measureScrollTargets();
    updateScrollMotion();
  }
  else if (motionFrame) {
    window.cancelAnimationFrame(motionFrame);
    motionFrame = 0;
  }
}

setScrollMotionEnabled(true);
motionToggle.addEventListener("click", () => {
  motionOverride = !document.body.classList.contains("motion-ready");
  setScrollMotionEnabled(motionOverride);
});
window.addEventListener("scroll", scheduleScrollMotion, { passive: true });
window.addEventListener("resize", () => {
  measureScrollTargets();
  scheduleScrollMotion();
}, { passive: true });
window.addEventListener("load", () => {
  measureScrollTargets();
  scheduleScrollMotion();
}, { once: true });
if ("ResizeObserver" in window) {
  const motionResizeObserver = new ResizeObserver(() => {
    measureScrollTargets();
    scheduleScrollMotion();
  });
  motionResizeObserver.observe(document.body);
  motionTargets.forEach(element => motionResizeObserver.observe(element));
  if (heroPhoto) motionResizeObserver.observe(heroPhoto);
}
motionPreference.addEventListener("change", event => {
  if (motionOverride === null) setScrollMotionEnabled(!event.matches);
});

renderQuestion();
