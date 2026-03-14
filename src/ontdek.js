const detail = document.querySelector("#gameDetails");
const closeBtn = document.querySelector("#closeGameDetails");
const cards = document.querySelectorAll(".game-card");

cards.forEach(card => {
  card.onclick = () => {

    document.querySelector("#gameTitle").textContent = card.dataset.title;
    document.querySelector("#gameDescription").textContent = card.dataset.description;
    document.querySelector("#gameRating").textContent = card.dataset.rating;
    document.querySelector("#gameDate").textContent = card.dataset.date;

    document.querySelector("#gameCover").src = card.dataset.image;

    detail.classList.remove("hidden");
    detail.classList.add("flex");
  };
});

closeBtn.onclick = () => {
  detail.classList.add("hidden");
  detail.classList.remove("flex");
};

detail.onclick = e => {
  if (e.target === detail) {
    detail.classList.add("hidden");
    detail.classList.remove("flex");
  }
};