const modal = document.querySelector("#gameModal");
const closeBtn = document.querySelector("#closeModal");
const cards = document.querySelectorAll(".game-card");

fetch("./data/details.json")
  .then(res => res.json())
  .then(games => {
    cards.forEach(card => {
      card.onclick = () => {
        const game = games.find(g => g.id == card.dataset.id);
        if (!game) return;

        document.querySelector("#modalTitle").textContent = game.title;
        document.querySelector("#modalDate").textContent = game.releaseDate;
        document.querySelector("#modalDescription").textContent = game.description;
        document.querySelector("#modalCover").src = game.cover;
        document.querySelector("#modalCover").alt = game.title;

        document.querySelector("#modalPlatforms").innerHTML = game.platforms
          .map(p => `<span class="rounded-full bg-white/10 px-5 py-3 text-lg text-slate-200">${p}</span>`)
          .join("");

        modal.classList.remove("hidden");
        modal.classList.add("flex");
      };
    });
  });

closeBtn.onclick = () => {
  modal.classList.add("hidden");
  modal.classList.remove("flex");
};

modal.onclick = e => {
  if (e.target === modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
};

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
});