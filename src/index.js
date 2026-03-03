document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".pop-up-container");
  const card = document.querySelector(".pop-up-card");
  const closeButton = document.querySelector(".pop-up-close");
  const lockedProjects = document.querySelectorAll(".not-available");

  if (!container  || !card || !closeButton || lockedProjects.length === 0) return;

  function toggleContainer(isOpen) {
    container.classList.toggle("opacity-100", isOpen);
    container.classList.toggle("pointer-events-auto", isOpen);
    container.classList.toggle("opacity-0", !isOpen);
    container.classList.toggle("pointer-events-none", !isOpen);

    card.classList.toggle("opacity-100", isOpen);
    card.classList.toggle("opacity-0", !isOpen);
  }

  lockedProjects.forEach((project) => {
    project.style.cursor = "pointer";
    project.addEventListener("click", (e) => {
      toggleContainer(true);
    });
  });

  closeButton.addEventListener("click", (e) => {
    e.stopPropagation(); 
    toggleContainer(false);
  });

  container.addEventListener("click", () => toggleContainer(false));
  card.addEventListener("click", (e) => e.stopPropagation());

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") toggleContainer(false);
  });
});