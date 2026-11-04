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
  ".section-heading, .bundle-card, .match-copy, .quiz-card, .step, .payment-copy, .contact-copy, .contact-form"
);
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  document.body.classList.add("reveal-ready");
  revealElements.forEach((element, index) => {
    element.classList.add("reveal");
    if (element.matches(".bundle-card, .step")) {
      element.classList.add(`reveal-delay-${(index % 3) + 1}`);
      if (index % 3 === 0) element.classList.add("reveal-from-left");
      if (index % 3 === 2) element.classList.add("reveal-from-right");
    }
  });

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.classList.toggle("is-visible", entry.isIntersecting);
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -8% 0px" });

  revealElements.forEach(element => revealObserver.observe(element));
}

renderQuestion();
