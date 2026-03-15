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

cards.forEach(card => {
  card.onclick = () => {
    currentId = card.dataset.id;
    currentTitle = card.dataset.title;

    document.querySelector("#gameTitle").textContent = card.dataset.title;
    document.querySelector("#gameDescription").textContent =
      card.dataset.description;
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

if (closeBtn) {
  closeBtn.onclick = () => {
    detail.classList.add("hidden");
    detail.classList.remove("flex");
  };
}

if (detail) {
  detail.onclick = e => {
    if (e.target === detail) {
      detail.classList.add("hidden");
      detail.classList.remove("flex");
    }
  };
}

function renderPlatforms(platformsString) {
  gamePlatforms.innerHTML = "";

  const platforms = (platformsString || "").split(",");

  platforms.forEach(platform => {
    const trimmed = platform.trim();
    if (!trimmed) return;

    const span = document.createElement("span");
    span.className = "rounded-full bg-white/10 px-5 py-3 text-lg text-slate-200";
    span.textContent = trimmed;
    gamePlatforms.appendChild(span);
  });
}

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
  localStorage.setItem(
    "collectionStatuses",
    JSON.stringify(collectionStatuses)
  );
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
  localStorage.setItem(
    "collectionNicknames",
    JSON.stringify(collectionNicknames)
  );
}

function isTitleInCollection(title) {
  const collectionTitles = getCollectionTitlesFromLocalStorage();
  return collectionTitles.includes(title);
}

function getGameStatus(title) {
  const collectionStatuses = getCollectionStatusesFromLocalStorage();
  return collectionStatuses[title] || "backlog";
}

function getCurrentGameObject(title, status = "backlog") {
  return {
    id: currentId,
    name: title,
    description: document.querySelector("#gameDescription").textContent,
    rating: document.querySelector("#gameRating").textContent,
    released: document.querySelector("#gameDate").textContent,
    background_image: document.querySelector("#gameCover").src,
    platforms: Array.from(document.querySelectorAll("#gamePlatforms span")).map(
      span => span.textContent
    ),
    status: status
  };
}

function addGameToCollection(title, status = "backlog") {
  let collectionTitles = getCollectionTitlesFromLocalStorage();
  let collectionStatuses = getCollectionStatusesFromLocalStorage();
  let collectionGames = getCollectionGamesFromLocalStorage();

  if (!collectionTitles.includes(title)) {
    collectionTitles.push(title);
  }

  collectionStatuses[title] = status;

  const bestaandIndex = collectionGames.findIndex(game => game.name === title);
  const nieuwGameObject = getCurrentGameObject(title, status);

  if (bestaandIndex === -1) {
    collectionGames.push(nieuwGameObject);
  } else {
    collectionGames[bestaandIndex] = {
      ...collectionGames[bestaandIndex],
      ...nieuwGameObject,
      status: status
    };
  }

  setCollectionTitlesToLocalStorage(collectionTitles);
  setCollectionStatusesToLocalStorage(collectionStatuses);
  setCollectionGamesToLocalStorage(collectionGames);
}

function removeGameFromCollection(title) {
  let collectionTitles = getCollectionTitlesFromLocalStorage();
  let collectionStatuses = getCollectionStatusesFromLocalStorage();
  let collectionGames = getCollectionGamesFromLocalStorage();
  let collectionNicknames = getCollectionNicknamesFromLocalStorage();

  collectionTitles = collectionTitles.filter(colTitle => colTitle !== title);
  collectionGames = collectionGames.filter(game => game.name !== title);

  delete collectionStatuses[title];
  delete collectionNicknames[title];

  setCollectionTitlesToLocalStorage(collectionTitles);
  setCollectionStatusesToLocalStorage(collectionStatuses);
  setCollectionGamesToLocalStorage(collectionGames);
  setCollectionNicknamesToLocalStorage(collectionNicknames);
}

function updateCollectionUI() {
  if (!isTitleInCollection(currentTitle)) {
    collectionStatus.textContent = "Niet in collectie";
    collectionStatus.className =
      "rounded-full px-4 py-2 text-sm font-semibold bg-red-600 text-white";

    collectionBtn.textContent = "Voeg toe aan collectie";
    collectionBtn.className =
      "w-fit min-w-[320px] rounded-xl px-8 py-4 text-xl font-semibold text-white transition bg-green-600 hover:bg-green-700";
  } else {
    const status = getGameStatus(currentTitle);

    if (status === "backlog") {
      collectionStatus.textContent = "Nog te spelen";
      collectionStatus.className =
        "rounded-full px-4 py-2 text-sm font-semibold bg-yellow-600 text-white";
    } else if (status === "playing") {
      collectionStatus.textContent = "Aan het spelen";
      collectionStatus.className =
        "rounded-full px-4 py-2 text-sm font-semibold bg-cyan-600 text-white";
    } else if (status === "finished") {
      collectionStatus.textContent = "Uitgespeeld";
      collectionStatus.className =
        "rounded-full px-4 py-2 text-sm font-semibold bg-green-600 text-white";
    }

    collectionBtn.textContent = "Verwijder uit collectie";
    collectionBtn.className =
      "w-fit min-w-[320px] rounded-xl px-8 py-4 text-xl font-semibold text-white transition bg-red-600 hover:bg-red-700";
  }
}

collectionBtn.onclick = () => {
  if (!currentTitle) return;

  let titles = getCollectionTitlesFromLocalStorage();
  let statuses = getCollectionStatusesFromLocalStorage();
  let nicknames = getCollectionNicknamesFromLocalStorage();
  let collectionGames = getCollectionGamesFromLocalStorage();

  if (titles.includes(currentTitle)) {
    const bevestiging = confirm(
      "Weet je zeker dat je deze game wilt verwijderen uit je collectie?"
    );

    if (bevestiging) {
      titles = titles.filter(t => t !== currentTitle);
      collectionGames = collectionGames.filter(game => game.name !== currentTitle);

      delete statuses[currentTitle];
      delete nicknames[currentTitle];

      setCollectionTitlesToLocalStorage(titles);
      setCollectionStatusesToLocalStorage(statuses);
      setCollectionNicknamesToLocalStorage(nicknames);
      setCollectionGamesToLocalStorage(collectionGames);
    }
  } else {
    const nickname = prompt("Geef een bijnaam voor deze game (optioneel):");

    if (!titles.includes(currentTitle)) {
      titles.push(currentTitle);
    }

    if (!statuses[currentTitle]) {
      statuses[currentTitle] = "backlog";
    }

    if (nickname && nickname.trim() !== "") {
      nicknames[currentTitle] = nickname.trim();
    }

    const bestaandIndex = collectionGames.findIndex(
      game => game.name === currentTitle
    );
    const nieuwGameObject = getCurrentGameObject(currentTitle, statuses[currentTitle]);

    if (bestaandIndex === -1) {
      collectionGames.push(nieuwGameObject);
    } else {
      collectionGames[bestaandIndex] = {
        ...collectionGames[bestaandIndex],
        ...nieuwGameObject,
        status: statuses[currentTitle]
      };
    }

    setCollectionTitlesToLocalStorage(titles);
    setCollectionStatusesToLocalStorage(statuses);
    setCollectionNicknamesToLocalStorage(nicknames);
    setCollectionGamesToLocalStorage(collectionGames);
  }

  updateCollectionUI();
};

if (setBacklogButton) {
  setBacklogButton.onclick = () => {
    if (!currentTitle) return;
    addGameToCollection(currentTitle, "backlog");
    updateCollectionUI();
  };
}

if (setPlayingButton) {
  setPlayingButton.onclick = () => {
    if (!currentTitle) return;
    addGameToCollection(currentTitle, "playing");
    updateCollectionUI();
  };
}

if (setFinishedButton) {
  setFinishedButton.onclick = () => {
    if (!currentTitle) return;
    addGameToCollection(currentTitle, "finished");
    updateCollectionUI();
  };
}