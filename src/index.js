document.addEventListener("DOMContentLoaded", () => {
  const page = window.location.pathname.split("/").pop();

  const signupForm = document.querySelector("#signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      window.location.href = "./login.html";
    });
  }

  const loginForm = document.querySelector("#loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      localStorage.setItem("isLoggedIn", "true");
      window.location.href = "./index.html";
    });
  }

  function requireLogin() {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      window.location.href = "./login.html";
    }
  }

  if (page === "" || page === "index.html") {
    requireLogin();
  }

  const modal = document.querySelector(".pop-up-container");
  const card = document.querySelector(".pop-up-card");
  const closeBtn = document.querySelector(".pop-up-close");
  const lockedProjects = document.querySelectorAll(".not-available");

  if (modal && card && closeBtn && lockedProjects.length > 0) {
    function openModal() {
      modal.classList.remove("opacity-0", "pointer-events-none");
      modal.classList.add("opacity-100", "pointer-events-auto");

      card.classList.remove("opacity-0");
      card.classList.add("opacity-100");
    }

    function closeModal() {
      modal.classList.remove("opacity-100", "pointer-events-auto");
      modal.classList.add("opacity-0", "pointer-events-none");

      card.classList.remove("opacity-100");
      card.classList.add("opacity-0");
    }

    lockedProjects.forEach((project) => {
      project.style.cursor = "pointer";
      project.addEventListener("click", (e) => {
        e.preventDefault();
        openModal();
      });
    });

    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeModal();
    });

    modal.addEventListener("click", closeModal);
    card.addEventListener("click", (e) => e.stopPropagation());

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });
  }
  if (!modal || !card || !closeBtn || lockedProjects.length === 0) return;

  function openModal() {
    modal.classList.remove("opacity-0", "pointer-events-none");
    modal.classList.add("opacity-100", "pointer-events-auto");

    card.classList.remove("opacity-0");
    card.classList.add("opacity-100");
  }

  function closeModal() {
    modal.classList.remove("opacity-100", "pointer-events-auto");
    modal.classList.add("opacity-0", "pointer-events-none");

    card.classList.remove("opacity-100");
    card.classList.add("opacity-0");
  }

  lockedProjects.forEach((project) => {
    project.style.cursor = "pointer";
    project.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    });
  });

  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    closeModal();
  });

  modal.addEventListener("click", closeModal);

  card.addEventListener("click", (e) => e.stopPropagation());

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
});