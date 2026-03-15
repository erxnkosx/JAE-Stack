const detail = document.querySelector("#gameDetails");
const closeBtn = document.querySelector("#closeGameDetails");
const cards = document.querySelectorAll(".game-card");

const collectionBtn = document.querySelector("#collectionBtn");
const collectionStatus = document.querySelector("#collectionStatus");
const gamePlatforms = document.querySelector("#gamePlatforms");

const setBacklogButton = document.getElementById("setBacklog");
const setPlayingButton = document.getElementById("setPlaying");
const setFinishedButton = document.getElementById("setFinished");

let currentId = "";
let currentTitle = "";

function getCollectionTitlesFromLocalStorage() {
  return JSON.parse(localStorage.getItem("collectionTitles") || "[]");
}

function setCollectionTitlesToLocalStorage(collectionTitles) {
  localStorage.setItem("collectionTitles", JSON.stringify(collectionTitles));
}

function getCollectionStatusesFromLocalStorage() {
  return JSON.parse(localStorage.getItem("collectionStatuses") || "{}");
}

function setCollectionStatusesToLocalStorage(collectionStatuses) {
  localStorage.setItem("collectionStatuses", JSON.stringify(collectionStatuses));
}

function getCollectionGamesFromLocalStorage() {
  return JSON.parse(localStorage.getItem("collectionGames") || "[]");
}

function setCollectionGamesToLocalStorage(collectionGames) {
  localStorage.setItem("collectionGames", JSON.stringify(collectionGames));
}

function getCollectionNicknamesFromLocalStorage() {
  return JSON.parse(localStorage.getItem("collectionNicknames") || "{}");
}

function setCollectionNicknamesToLocalStorage(collectionNicknames) {
  localStorage.setItem("collectionNicknames", JSON.stringify(collectionNicknames));
}

function getStorageData() {
  return {
    titles: getCollectionTitlesFromLocalStorage(),
    statuses: getCollectionStatusesFromLocalStorage(),
    games: getCollectionGamesFromLocalStorage(),
    nicknames: getCollectionNicknamesFromLocalStorage()
  };
}

function saveStorageData({ titles, statuses, games, nicknames }) {
  setCollectionTitlesToLocalStorage(titles);
  setCollectionStatusesToLocalStorage(statuses);
  setCollectionGamesToLocalStorage(games);
  setCollectionNicknamesToLocalStorage(nicknames);
}

function isTitleInCollection(title) {
  const { titles } = getStorageData();
  return titles.includes(title);
}

function getGameStatus(title) {
  const { statuses } = getStorageData();
  return statuses[title] || "backlog";
}

function renderPlatforms(platformsString) {
  gamePlatforms.innerHTML = "";

  (platformsString || "").split(",").forEach(platform => {
    const trimmed = platform.trim();
    if (!trimmed) return;

    const span = document.createElement("span");
    span.className = "rounded-full bg-white/10 px-5 py-3 text-lg text-slate-200";
    span.textContent = trimmed;
    gamePlatforms.appendChild(span);
  });
}

function getCurrentGameObject(title, status = "backlog") {
  return {
    id: currentId,
    name: title,
    description: document.querySelector("#gameDescription").textContent,
    rating: document.querySelector("#gameRating").textContent,
    released: document.querySelector("#gameDate").textContent,
    background_image: document.querySelector("#gameCover").src,
    platforms: Array.from(document.querySelectorAll("#gamePlatforms span"))
      .map(span => span.textContent)
      .join(", "),
    status
  };
}

function addOrUpdateGame(title, status = "backlog", nickname = "") {
  const data = getStorageData();

  if (!data.titles.includes(title)) {
    data.titles.push(title);
  }

  data.statuses[title] = status;

  const index = data.games.findIndex(game => game.name === title);
  const gameObject = getCurrentGameObject(title, status);

  if (index === -1) {
    data.games.push(gameObject);
  } else {
    data.games[index] = { ...data.games[index], ...gameObject, status };
  }

  if (nickname && nickname.trim() !== "") {
    data.nicknames[title] = nickname.trim();
  }

  saveStorageData(data);
}

function removeGameFromCollection(title) {
  const data = getStorageData();

  data.titles = data.titles.filter(t => t !== title);
  data.games = data.games.filter(game => game.name !== title);

  delete data.statuses[title];
  delete data.nicknames[title];

  saveStorageData(data);
}

function updateCollectionUI() {
  if (!isTitleInCollection(currentTitle)) {
    collectionStatus.textContent = "Niet in collectie";
    collectionStatus.className =
      "rounded-full px-4 py-2 text-sm font-semibold bg-red-600 text-white";

    collectionBtn.textContent = "Voeg toe aan collectie";
    collectionBtn.className =
      "w-fit min-w-[320px] rounded-xl px-8 py-4 text-xl font-semibold text-white transition bg-green-600 hover:bg-green-700";
    return;
  }

  const status = getGameStatus(currentTitle);

  if (status === "backlog") {
    collectionStatus.textContent = "Nog te spelen";
    collectionStatus.className =
      "rounded-full px-4 py-2 text-sm font-semibold bg-yellow-600 text-white";
  } else if (status === "playing") {
    collectionStatus.textContent = "Aan het spelen";
    collectionStatus.className =
      "rounded-full px-4 py-2 text-sm font-semibold bg-cyan-600 text-white";
  } else {
    collectionStatus.textContent = "Uitgespeeld";
    collectionStatus.className =
      "rounded-full px-4 py-2 text-sm font-semibold bg-green-600 text-white";
  }

  collectionBtn.textContent = "Verwijder uit collectie";
  collectionBtn.className =
    "w-fit min-w-[320px] rounded-xl px-8 py-4 text-xl font-semibold text-white transition bg-red-600 hover:bg-red-700";
}

cards.forEach(card => {
  card.onclick = () => {
    currentId = card.dataset.id;
    currentTitle = card.dataset.title;

    document.querySelector("#gameTitle").textContent = card.dataset.title;
    document.querySelector("#gameDescription").textContent = card.dataset.description;
    document.querySelector("#gameRating").textContent = card.dataset.rating;
    document.querySelector("#gameDate").textContent = card.dataset.date;
    document.querySelector("#gameCover").src = card.dataset.image;
    document.querySelector("#gameCover").alt = card.dataset.title;

    renderPlatforms(card.dataset.platforms);
    updateCollectionUI();

    detail.classList.remove("hidden");
    detail.classList.add("flex");
  };
});

closeBtn?.addEventListener("click", () => {
  detail.classList.add("hidden");
  detail.classList.remove("flex");
});

detail?.addEventListener("click", e => {
  if (e.target === detail) {
    detail.classList.add("hidden");
    detail.classList.remove("flex");
  }
});

collectionBtn.onclick = () => {
  if (!currentTitle) return;

  if (isTitleInCollection(currentTitle)) {
    const bevestiging = confirm(
      "Weet je zeker dat je deze game wilt verwijderen uit je collectie?"
    );

    if (bevestiging) {
      removeGameFromCollection(currentTitle);
    }
  } else {
    const nickname = prompt("Geef een bijnaam voor deze game (optioneel):");
    addOrUpdateGame(currentTitle, "backlog", nickname);
  }

  updateCollectionUI();
};

setBacklogButton?.addEventListener("click", () => {
  if (!currentTitle) return;
  addOrUpdateGame(currentTitle, "backlog");
  updateCollectionUI();
});

setPlayingButton?.addEventListener("click", () => {
  if (!currentTitle) return;

  const data = getStorageData();

  if (!data.titles.includes(currentTitle)) {
    data.titles.push(currentTitle);
  }

  Object.keys(data.statuses).forEach(title => {
    if (data.statuses[title] === "playing") {
      data.statuses[title] = "backlog";
    }
  });

  saveStorageData(data);
  addOrUpdateGame(currentTitle, "playing");
  updateCollectionUI();
});

setFinishedButton?.addEventListener("click", () => {
  if (!currentTitle) return;
  addOrUpdateGame(currentTitle, "finished");
  updateCollectionUI();
});