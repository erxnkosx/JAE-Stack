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

const addToCollectionDetailButton = document.getElementById("collectionBtn");
const gameTitle = document.getElementById("gameTitle");
let collectionTitles = getCollectionTitlesFromLocalStorage();

let games = [];

const loadGames = async () => {
  const response = await fetch("../data/details.json");
  const responseJson = await response.json();
  let results = responseJson.results;
  const ids = results.map(res => res.id);

  const descriptions = await Promise.all(ids.map(async id => {
    const response2 = await fetch(`https://api.rawg.io/api/games/${id}?key=09f7894c43764394b1691501eba8bb44`);
    const response2Json = await response2.json();
    const description = `${response2Json.description_raw.split(".")[0]}.`;
    return description;
  }));

  results = results.map((res, idx) => ({
    ...res,
    description: descriptions[idx]
  }));
  return results;
};

(async () => games = await loadGames())();

function isTitleInCollection(title) {
  return collectionTitles.includes(title);
}

function removeTitleFromCollection(title) {
  collectionTitles = collectionTitles.filter(colTitle => colTitle !== title);
}

function addTitleToCollection(title) {
  collectionTitles.push(title);
}

function setCollectionTitlesToLocalStorage() {
  localStorage.setItem("collectionTitles", JSON.stringify(collectionTitles));
}

function getCollectionTitlesFromLocalStorage() {
  return JSON.parse(localStorage.getItem("collectionTitles") || "[]");
}

function addToCollectionHandler(title) {
  collectionTitles =  getCollectionTitlesFromLocalStorage();
  if (isTitleInCollection(title)) {
    removeTitleFromCollection(title);
  }
  else {
    addTitleToCollection(title);
  }
  setCollectionTitlesToLocalStorage();
}



function sortGames(games, sortBy) {
  const sortedGames = [...games];

  if (sortBy === "released") {
    sortedGames.sort((a, b) => new Date(b.released) - new Date(a.released));
  } else if (sortBy === "rating") {
    sortedGames.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (sortBy === "name") {
    sortedGames.sort((a, b) => a.name.localeCompare(b.name));
  }

  return sortedGames;
}

addToCollectionDetailButton.addEventListener("click", (e) => {
  addToCollectionHandler(gameTitle.textContent);
  console.log(collectionTitles);

});

console.log(games);


