const detail = document.querySelector("#gameDetails");
const closeBtn = document.querySelector("#closeGameDetails");
const cards = document.querySelectorAll(".game-card");

const collectionBtn = document.querySelector("#collectionBtn");
const collectionStatus = document.querySelector("#collectionStatus");
const gamePlatforms = document.querySelector("#gamePlatforms");

const gameSearch = document.getElementById("gameSearch");
const suggestions = document.getElementById("suggestions");

const collection = [];
let currentId = "";

cards.forEach(card => {
  card.onclick = () => {

    document.querySelector("#gameTitle").textContent = card.dataset.title;
    document.querySelector("#gameDescription").textContent = card.dataset.description;
    document.querySelector("#gameRating").textContent = card.dataset.rating;
    document.querySelector("#gameDate").textContent = card.dataset.date;

    document.querySelector("#gameCover").src = card.dataset.image;

    updateCollectionUI();

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

function inCollection(id) {
  return collection.includes(id);
}

function updateCollectionUI() {
  if (inCollection(currentId)) {
    collectionStatus.textContent = "In collectie";
    collectionStatus.className =
      "mt-3 rounded-full px-4 py-2 text-sm font-semibold bg-green-600 text-white";

    collectionBtn.textContent = "Verwijder uit collectie";
    collectionBtn.className =
      "w-fit min-w-[320px] rounded-xl px-8 py-4 text-xl font-semibold text-white transition bg-red-600 hover:bg-red-700";
  } else {
    collectionStatus.textContent = "Niet in collectie";
    collectionStatus.className =
      "mt-3 rounded-full px-4 py-2 text-sm font-semibold bg-red-600 text-white";

    collectionBtn.textContent = "Voeg toe aan collectie";
    collectionBtn.className =
      "w-fit min-w-[320px] rounded-xl px-8 py-4 text-xl font-semibold text-white transition bg-green-600 hover:bg-green-700";
  }
}

collectionBtn.onclick = () => {
  if (inCollection(currentId)) {
    const bevestiging = confirm(
      "Weet je zeker dat je deze game wilt verwijderen uit je collectie?"
    );

    if (bevestiging) {
      const index = collection.indexOf(currentId);
      collection.splice(index, 1);
    }
  } else {
    prompt("Geef een bijnaam (optioneel):");
    prompt(
      "Geef status: Nog te spelen / Aan het spelen / Uitgespeeld",
      "Nog te spelen"
    );

    collection.push(currentId);
  }

  updateCollectionUI();
};
