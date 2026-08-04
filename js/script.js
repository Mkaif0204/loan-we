document.addEventListener("DOMContentLoaded", function () {
  const select = (name) => document.querySelector(name);
  const selectAll = (name) => document.querySelectorAll(name);

  setTimeout(function () {
    const loader = select(".preloader");
    if (loader) loader.classList.add("hide");
  }, 350);

  const menuButton = select(".nav-toggle");
  const navigation = select(".nav");
  const header = select(".header");
  const topButton = select(".to-top");

  if (menuButton) {
    menuButton.addEventListener("click", function () {
      navigation.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", navigation.classList.contains("open"));
    });
  }

  window.addEventListener("scroll", function () {
    if (header) header.classList.toggle("scrolled", window.scrollY > 20);
    if (topButton) topButton.classList.toggle("visible", window.scrollY > 400);
  });

  if (topButton) {
    topButton.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const themeButton = select(".theme-toggle");
  if (localStorage.getItem("finoraTheme") === "dark") document.body.classList.add("dark");
  if (themeButton) {
    themeButton.addEventListener("click", function () {
      document.body.classList.toggle("dark");
      const theme = document.body.classList.contains("dark") ? "dark" : "light";
      localStorage.setItem("finoraTheme", theme);
    });
  }

  function showToast(message) {
    const toast = select(".toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
  }

  selectAll(".newsletter-form").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const email = form.querySelector("input");
      if (email.checkValidity()) {
        showToast("Thanks for subscribing!");
        form.reset();
      } else {
        showToast("Please enter a valid email address.");
      }
    });
  });

  selectAll(".accordion button").forEach(function (question) {
    question.addEventListener("click", function () {
      const answer = question.nextElementSibling;
      answer.classList.toggle("open");
      question.querySelector("i").textContent = answer.classList.contains("open") ? "−" : "+";
    });
  });

  const chatButton = select(".chat-button");
  const chatPanel = select(".chat-panel");
  if (chatButton) chatButton.addEventListener("click", () => chatPanel.classList.toggle("show"));
  const closeChat = select(".chat-panel button");
  if (closeChat) closeChat.addEventListener("click", () => chatPanel.classList.remove("show"));

  const contactForm = select(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const requiredFields = contactForm.querySelectorAll("[required]");
      const formIsValid = [...requiredFields].every((field) => field.checkValidity());
      if (formIsValid) {
        showToast("Message sent! We will contact you shortly.");
        contactForm.reset();
      } else {
        showToast("Please fill in all required fields.");
      }
    });
  }

  const amountSlider = select("#amount");
  const rateSlider = select("#rate");
  const tenureSlider = select("#tenure");

  function formatMoney(number) {
    return "₹ " + Math.round(number).toLocaleString("en-IN");
  }

  function updateEmi() {
    if (!amountSlider) return;
    const principal = Number(amountSlider.value);
    const monthlyRate = Number(rateSlider.value) / 1200;
    const months = Number(tenureSlider.value) * 12;
    const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalPayment = emi * months;
    const interest = totalPayment - principal;
    const principalPercent = Math.round((principal / totalPayment) * 100);

    select("#amountOut").textContent = formatMoney(principal);
    select("#rateOut").textContent = rateSlider.value + "% p.a.";
    select("#tenureOut").textContent = tenureSlider.value + " years";
    select("#emi").textContent = formatMoney(emi);
    select("#principal").textContent = formatMoney(principal);
    select("#interest").textContent = formatMoney(interest);
    select("#total").textContent = formatMoney(totalPayment);
    select("#principalPct").textContent = principalPercent + "%";
    select("#donut").style.background = `conic-gradient(#aee1da 0 ${principalPercent}%, #edb099 ${principalPercent}%)`;
  }

  [amountSlider, rateSlider, tenureSlider].forEach(function (slider) {
    if (slider) slider.addEventListener("input", updateEmi);
  });
  updateEmi();

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  selectAll(".reveal").forEach((item) => revealObserver.observe(item));
});
