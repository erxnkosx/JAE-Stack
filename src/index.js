document.addEventListener("DOMContentLoaded", () => {
  const modal = document.querySelector(".pop-up-container");
  const card = document.querySelector(".pop-up-card");
  const closeButton = document.querySelector(".pop-up-close");
  const lockedProjects = document.querySelectorAll(".not-available");

  if (!modal || !card || !closeButton || lockedProjects.length === 0) return;

  function toggleModal(isOpen) {
    modal.classList.toggle("opacity-100", isOpen);
    modal.classList.toggle("pointer-events-auto", isOpen);
    modal.classList.toggle("opacity-0", !isOpen);
    modal.classList.toggle("pointer-events-none", !isOpen);

    card.classList.toggle("opacity-100", isOpen);
    card.classList.toggle("opacity-0", !isOpen);
  }

  lockedProjects.forEach((project) => {
    project.style.cursor = "pointer";
    project.addEventListener("click", (e) => {
      e.preventDefault(); 
      toggleModal(true);
    });
  });

  closeButton.addEventListener("click", (e) => {
    e.stopPropagation(); 
    toggleModal(false);
  });

  modal.addEventListener("click", () => toggleModal(false));
  card.addEventListener("click", (e) => e.stopPropagation());

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") toggleModal(false);
  });
});