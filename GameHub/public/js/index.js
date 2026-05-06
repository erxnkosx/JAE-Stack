document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("locked_modal");
  const closeBtn = document.getElementById("modal-close");
  const lockedProjects = document.querySelectorAll(".not-available");

  if (!modal || lockedProjects.length === 0) return;

  modal.style.display = "none";

  lockedProjects.forEach((project) => {
    project.style.cursor = "pointer";
    project.addEventListener("click", () => {
      modal.style.display = "";
      modal.showModal();
    });
  });

  closeBtn.addEventListener("click", () => {
    modal.close();
    modal.style.display = "none";
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.close();
      modal.style.display = "none";
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      modal.close();
      modal.style.display = "none";
    }
  });
});