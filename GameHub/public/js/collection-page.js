const detail = document.querySelector("#gameDetails");
const closeBtn = document.querySelector("#closeGameDetails");
const gameCollection = document.getElementById("gameCollection");

const collectionBtn = document.getElementById("collectionBtn");
const collectionStatus = document.getElementById("collectionStatus");
const gameTitle = document.getElementById("gameTitle");

const listViewButton = document.getElementById("listView");
const gridViewButton = document.getElementById("gridView");

const filterAllButton = document.getElementById("filterAll");
const filterBacklogButton = document.getElementById("filterBacklog");
const filterPlayingButton = document.getElementById("filterPlaying");
const filterFinishedButton = document.getElementById("filterFinished");

const countAll = document.getElementById("countAll");
const countBacklog = document.getElementById("countBacklog");
const countPlaying = document.getElementById("countPlaying");
const countFinished = document.getElementById("countFinished");

const setBacklogButton = document.getElementById("setBacklog");
const setPlayingButton = document.getElementById("setPlaying");
const setFinishedButton = document.getElementById("setFinished");

const collectionCounter = document.getElementById("collectionCounter");
const sortGamesSelect = document.getElementById("sortGames");

let currentView = "grid";
let currentSort = "rating";
let currentFilter = "all";
let currentTitle = "";
let currentId = "";

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

function refreshData() {
  const data = getStorageData();
  return data;
}

function isTitleInCollection(title) {
  const { titles } = getStorageData();
  return titles.includes(title);
}

function getGameStatus(title) {
  const { statuses } = getStorageData();
  return statuses[title] || "backlog";
}

function getCurrentGameObject(title, status = "backlog") {
  return {
    id: currentId,
    name: title,
    description: document.querySelector("#gameDescription").textContent,
    rating: document.querySelector("#gameRating").textContent,
    released: document.querySelector("#gameDate").textContent,
    background_image: document.querySelector("#gameCover").src,
    status
  };
}

function getGameObjectFromStoredGames(title) {
  const { games } = getStorageData();
  return games.find(game => game.name === title);
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

function updateCollectionUI(title) {
  if (!isTitleInCollection(title)) {
    collectionStatus.textContent = "Niet in collectie";
    collectionStatus.className =
      "rounded-full px-4 py-2 text-sm font-semibold bg-red-600 text-white";

    collectionBtn.textContent = "Voeg toe aan collectie";
    collectionBtn.className =
      "w-fit min-w-[320px] rounded-xl px-8 py-4 text-xl font-semibold text-white transition bg-green-600 hover:bg-green-700";
    return;
  }

  const status = getGameStatus(title);

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

function sortGames(gamesToSort, sortBy) {
  const sortedGames = [...gamesToSort];

  if (sortBy === "released") {
    sortedGames.sort((a, b) => new Date(b.released) - new Date(a.released));
  } else if (sortBy === "rating") {
    sortedGames.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
  } else if (sortBy === "name") {
    sortedGames.sort((a, b) => a.name.localeCompare(b.name));
  }

  return sortedGames;
}

function applyViewClass() {
  if (currentView === "grid") {
    gameCollection.className =
      "mt-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8";
    gridViewButton.className =
      "p-2 bg-cyan-500/20 text-cyan-400 rounded-lg";
    listViewButton.className =
      "p-2 text-slate-500 hover:text-gray-300";
  } else {
    gameCollection.className =
      "mt-6 flex flex-col gap-8 items-center w-full";
    gridViewButton.className =
      "p-2 text-slate-500 hover:text-gray-300";
    listViewButton.className =
      "p-2 bg-cyan-500/20 text-cyan-400 rounded-lg";
  }
}

function noGames() {
  gameCollection.className = "flex flex-col items-center justify-center py-32";
  gameCollection.innerHTML = `
    <p class="text-slate-500 text-lg mb-6">Geen games in dit categorie</p>
    <a href="./ontdek.html" class="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-8 rounded-2xl transition shadow-lg shadow-purple-500/20">
      Ontdek Games
    </a>
  `;
}

function updateCategoryButtonStyles() {
  const activeClass =
    "category-btn px-6 py-3 rounded-xl bg-gray-900/50 border border-cyan-400 text-sm font-semibold text-cyan-400 transition";
  const inactiveClass =
    "category-btn px-6 py-3 rounded-xl bg-gray-900/50 border border-gray-800 text-sm font-semibold text-slate-400 hover:border-cyan-400 hover:text-cyan-400 transition";

  filterAllButton.className = currentFilter === "all" ? activeClass : inactiveClass;
  filterBacklogButton.className = currentFilter === "backlog" ? activeClass : inactiveClass;
  filterPlayingButton.className = currentFilter === "playing" ? activeClass : inactiveClass;
  filterFinishedButton.className = currentFilter === "finished" ? activeClass : inactiveClass;
}

function updateCategoryCounts() {
  const data = refreshData();

  countAll.textContent = data.titles.length;
  countBacklog.textContent = data.titles.filter(title => getGameStatus(title) === "backlog").length;
  countPlaying.textContent = data.titles.filter(title => getGameStatus(title) === "playing").length;
  countFinished.textContent = data.titles.filter(title => getGameStatus(title) === "finished").length;
}

function updateCollectionCounter() {
  const data = refreshData();
  collectionCounter.textContent = data.titles.length;
}

function renderGames() {
  const data = refreshData();

  let collectionGames = data.games.filter(game => data.titles.includes(game.name));

  if (currentFilter !== "all") {
    collectionGames = collectionGames.filter(game => getGameStatus(game.name) === currentFilter);
  }

  const sortedCollectionGames = sortGames(collectionGames, currentSort);

  updateCategoryCounts();
  updateCategoryButtonStyles();

  if (sortedCollectionGames.length === 0) {
    noGames();
    return;
  }

  applyViewClass();

  gameCollection.innerHTML = sortedCollectionGames
    .map(g => {
      let statusText = "Nog te spelen";

      if (getGameStatus(g.name) === "playing") statusText = "Aan het spelen";
      if (getGameStatus(g.name) === "finished") statusText = "Uitgespeeld";

      return `
        <article
          class="w-full game-card group rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md hover:scale-[1.02] transition duration-300"
          data-id="${g.id || ""}"
          data-title="${g.name}"
          data-description="${g.description}"
          data-rating="${g.rating}"
          data-date="${g.released}"
          data-image="${g.background_image}"
        >
          <section class="relative">
            <img
              src="${g.background_image}"
              alt="game card"
              class="w-full h-[420px] object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            <span class="absolute top-4 left-4 flex items-center gap-2 bg-zinc-900/80 text-yellow-400 px-4 py-2 rounded-2xl text-lg font-bold">
              <span>⭐</span><span>${g.rating}</span>
            </span>
          </section>
          <section class="p-6">
            <div class="flex items-center justify-between gap-4 mb-2">
              <h3 class="text-2xl font-bold text-white">${g.name}</h3>
              <span class="text-xs px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">${statusText}</span>
            </div>
            <p class="text-slate-300 text-sm leading-relaxed mb-3">${g.description}</p>
            <p class="text-slate-400">${g.released}</p>
          </section>
        </article>
      `;
    })
    .join("");

  updateCards();
}

function updateCards() {
  const cards = document.querySelectorAll(".game-card");

  cards.forEach(card => {
    card.onclick = () => {
      currentId = card.dataset.id || "";
      currentTitle = card.dataset.title;

      document.querySelector("#gameTitle").textContent = card.dataset.title;
      document.querySelector("#gameDescription").textContent = card.dataset.description;
      document.querySelector("#gameRating").textContent = card.dataset.rating;
      document.querySelector("#gameDate").textContent = card.dataset.date;
      document.querySelector("#gameCover").src = card.dataset.image;
      document.querySelector("#gameCover").alt = card.dataset.title;

      updateCollectionUI(currentTitle);

      detail.classList.remove("hidden");
      detail.classList.add("flex");
    };
  });
}

function changeStatus(status) {
  const title = gameTitle.textContent.trim();
  if (!title) return;

  if (status === "playing") {
    const data = getStorageData();

    if (!data.titles.includes(title)) {
      data.titles.push(title);
    }

    Object.keys(data.statuses).forEach(gameTitleKey => {
      if (data.statuses[gameTitleKey] === "playing") {
        data.statuses[gameTitleKey] = "backlog";
      }
    });

    saveStorageData(data);
    addOrUpdateGame(title, "playing");
  } else {
    addOrUpdateGame(title, status);
  }

  renderGames();
  updateCollectionCounter();
  updateCollectionUI(title);
}

collectionBtn?.addEventListener("click", () => {
  const title = gameTitle.textContent.trim();
  if (!title) return;

  if (isTitleInCollection(title)) {
    const bevestiging = confirm("Weet je zeker dat je deze game wilt verwijderen uit je collectie?");
    if (!bevestiging) return;
    removeGameFromCollection(title);
  } else {
    const nickname = prompt("Geef een bijnaam voor deze game (optioneel):");
    addOrUpdateGame(title, "backlog", nickname || "");
  }

  renderGames();
  updateCollectionCounter();
  updateCollectionUI(title);
});

setBacklogButton?.addEventListener("click", () => changeStatus("backlog"));
setPlayingButton?.addEventListener("click", () => changeStatus("playing"));
setFinishedButton?.addEventListener("click", () => changeStatus("finished"));

gridViewButton?.addEventListener("click", () => {
  currentView = "grid";
  renderGames();
});

listViewButton?.addEventListener("click", () => {
  currentView = "list";
  renderGames();
});

filterAllButton?.addEventListener("click", () => {
  currentFilter = "all";
  renderGames();
});

filterBacklogButton?.addEventListener("click", () => {
  currentFilter = "backlog";
  renderGames();
});

filterPlayingButton?.addEventListener("click", () => {
  currentFilter = "playing";
  renderGames();
});

filterFinishedButton?.addEventListener("click", () => {
  currentFilter = "finished";
  renderGames();
});

sortGamesSelect?.addEventListener("change", e => {
  currentSort = e.target.value;
  renderGames();
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

function start() {
  renderGames();
  updateCollectionCounter();
  updateCategoryCounts();
}

start();