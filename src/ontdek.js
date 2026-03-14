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

const gameSearch = document.getElementById("gameSearch");
const suggestions = document.getElementById("suggestions");

async function gameSearchHandler(input) {
    if (input.length > 1) {
        let results = games.filter(g => g.title.toLowerCase().startsWith(input.slice(0, 3).toLowerCase()));
        suggestions.classList.remove("hidden");
        suggestions.innerHTML = results.map(r => `<div class="hover:bg-white/10 text-white px-4 py-3 cursor-pointer ">${r.title}</div>`).join("");

    }
    else {
        suggestions.classList.add("hidden");

        suggestions.innerHTML = "";
    }
}