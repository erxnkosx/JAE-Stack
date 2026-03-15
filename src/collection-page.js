function updateCards() {
    const detail = document.querySelector("#gameDetails");
    const closeBtn = document.querySelector("#closeGameDetails");
    const cards = document.querySelectorAll(".game-card");
    const collectionBtn = document.querySelector("#collectionBtn");
    const collectionStatus = document.querySelector("#collectionStatus");
    const gamePlatforms = document.querySelector("#gamePlatforms");

    cards.forEach(card => {
        card.onclick = () => {
            const title = card.dataset.title;

            document.querySelector("#gameTitle").textContent = card.dataset.title;
            document.querySelector("#gameDescription").textContent = card.dataset.description;
            document.querySelector("#gameRating").textContent = card.dataset.rating;
            document.querySelector("#gameDate").textContent = card.dataset.date;
            document.querySelector("#gameCover").src = card.dataset.image;
            document.querySelector("#gameCover").alt = card.dataset.title;

            renderPlatforms(card.dataset.platforms, gamePlatforms);
            updateDetailModalUI(title, collectionBtn, collectionStatus);

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
}

let games = [];
let collectionTitles = getCollectionTitlesFromLocalStorage();
let collectionStatuses = getCollectionStatusesFromLocalStorage();

const gameCollection = document.getElementById("gameCollection");
const addToCollectionDetailButton = document.getElementById("collectionBtn");
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

let currentView = "grid";
let currentSort = "rating";
let currentFilter = "all";

function getCollectionTitlesFromLocalStorage() {
    return JSON.parse(localStorage.getItem("collectionTitles") || "[]");
}

function setCollectionTitlesToLocalStorage() {
    localStorage.setItem("collectionTitles", JSON.stringify(collectionTitles));
}

function getCollectionStatusesFromLocalStorage() {
    return JSON.parse(localStorage.getItem("collectionStatuses") || "{}");
}

function setCollectionStatusesToLocalStorage() {
    localStorage.setItem("collectionStatuses", JSON.stringify(collectionStatuses));
}

function isTitleInCollection(title) {
    collectionTitles = getCollectionTitlesFromLocalStorage();
    return collectionTitles.includes(title);
}

function removeTitleFromCollection(title) {
    collectionTitles = collectionTitles.filter(colTitle => colTitle !== title);
    delete collectionStatuses[title];
}

function addTitleToCollection(title) {
    if (!collectionTitles.includes(title)) {
        collectionTitles.push(title);
    }

    if (!collectionStatuses[title]) {
        collectionStatuses[title] = "backlog";
    }
}

function addToCollectionHandler(title) {
    collectionTitles = getCollectionTitlesFromLocalStorage();
    collectionStatuses = getCollectionStatusesFromLocalStorage();

    if (isTitleInCollection(title)) {
        removeTitleFromCollection(title);
    } else {
        addTitleToCollection(title);
    }

    setCollectionTitlesToLocalStorage();
    setCollectionStatusesToLocalStorage();
}

function getGameStatus(title) {
    collectionStatuses = getCollectionStatusesFromLocalStorage();
    return collectionStatuses[title] || "backlog";
}

function setGameStatus(title, status) {
    collectionStatuses = getCollectionStatusesFromLocalStorage();
    collectionStatuses[title] = status;
    setCollectionStatusesToLocalStorage();
}

function renderPlatforms(platformsString, container) {
    if (!container) return;

    container.innerHTML = "";

    const platforms = (platformsString || "").split(",");

    platforms.forEach(platform => {
        const trimmed = platform.trim();
        if (!trimmed) return;

        const span = document.createElement("span");
        span.className = "rounded-full bg-white/10 px-5 py-3 text-lg text-slate-200";
        span.textContent = trimmed;
        container.appendChild(span);
    });
}

function updateDetailModalUI(title, collectionBtn, collectionStatus) {
    if (!collectionBtn || !collectionStatus) return;

    if (!isTitleInCollection(title)) {
        collectionStatus.textContent = "Niet in collectie";
        collectionStatus.className =
            "rounded-full px-4 py-2 text-sm font-semibold bg-red-600 text-white";

        collectionBtn.textContent = "Voeg toe aan collectie";
        collectionBtn.className =
            "w-fit min-w-[320px] rounded-xl px-8 py-4 text-xl font-semibold text-white transition bg-green-600 hover:bg-green-700";
    } else {
        const status = getGameStatus(title);

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

async function loadGames() {
    const response = await fetch("../data/details.json");
    const responseJson = await response.json();
    let results = responseJson.results;

    const ids = results.map(res => res.id);

    const descriptions = await Promise.all(
        ids.map(async id => {
            const response2 = await fetch(`https://api.rawg.io/api/games/${id}?key=b98606b4c7c748e991abd01ef0674fdc`);
            const response2Json = await response2.json();

            if (!response2Json.description_raw) {
                return "Geen beschrijving beschikbaar.";
            }

            return `${response2Json.description_raw.split(".")[0]}.`;
        })
    );

    results = results.map((res, idx) => ({
        ...res,
        description: descriptions[idx]
    }));

    return results;
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

function applyViewClass() {
    if (currentView === "grid") {
        gameCollection.className = "mt-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8";
        gridViewButton.className = "p-2 bg-cyan-500/20 text-cyan-400 rounded-lg";
        listViewButton.className = "p-2 text-slate-500 hover:text-gray-300";
    } else {
        gameCollection.className = "mt-6 flex flex-col gap-12 items-center justify-center px-32";
        gridViewButton.className = "p-2 text-slate-500 hover:text-gray-300";
        listViewButton.className = "p-2 bg-cyan-500/20 text-cyan-400 rounded-lg";
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
    const activeClass = "category-btn px-6 py-3 rounded-xl bg-gray-900/50 border border-cyan-400 text-sm font-semibold text-cyan-400 transition";
    const inactiveClass = "category-btn px-6 py-3 rounded-xl bg-gray-900/50 border border-gray-800 text-sm font-semibold text-slate-400 hover:border-cyan-400 hover:text-cyan-400 transition";

    if (filterAllButton) filterAllButton.className = currentFilter === "all" ? activeClass : inactiveClass;
    if (filterBacklogButton) filterBacklogButton.className = currentFilter === "backlog" ? activeClass : inactiveClass;
    if (filterPlayingButton) filterPlayingButton.className = currentFilter === "playing" ? activeClass : inactiveClass;
    if (filterFinishedButton) filterFinishedButton.className = currentFilter === "finished" ? activeClass : inactiveClass;
}

function updateCategoryCounts() {
    collectionTitles = getCollectionTitlesFromLocalStorage();
    collectionStatuses = getCollectionStatusesFromLocalStorage();

    const backlogCount = collectionTitles.filter(title => getGameStatus(title) === "backlog").length;
    const playingCount = collectionTitles.filter(title => getGameStatus(title) === "playing").length;
    const finishedCount = collectionTitles.filter(title => getGameStatus(title) === "finished").length;

    if (countAll) countAll.textContent = collectionTitles.length;
    if (countBacklog) countBacklog.textContent = backlogCount;
    if (countPlaying) countPlaying.textContent = playingCount;
    if (countFinished) countFinished.textContent = finishedCount;
}

function updateCollectionCounter() {
    collectionTitles = getCollectionTitlesFromLocalStorage();

    if (collectionCounter) {
        collectionCounter.textContent = collectionTitles.length;
    }
}

function renderGames() {
    collectionTitles = getCollectionTitlesFromLocalStorage();
    collectionStatuses = getCollectionStatusesFromLocalStorage();

    let collectionGames = games.filter(game => collectionTitles.includes(game.name));

    if (currentFilter === "backlog") {
        collectionGames = collectionGames.filter(game => getGameStatus(game.name) === "backlog");
    } else if (currentFilter === "playing") {
        collectionGames = collectionGames.filter(game => getGameStatus(game.name) === "playing");
    } else if (currentFilter === "finished") {
        collectionGames = collectionGames.filter(game => getGameStatus(game.name) === "finished");
    }

    const sortedCollectionGames = sortGames(collectionGames, currentSort);

    updateCategoryCounts();
    updateCategoryButtonStyles();

    if (sortedCollectionGames.length === 0) {
        noGames();
        return;
    }

    applyViewClass();

    let result = "";

    sortedCollectionGames.forEach(g => {
        let statusText = "Nog te spelen";

        if (getGameStatus(g.name) === "playing") {
            statusText = "Aan het spelen";
        } else if (getGameStatus(g.name) === "finished") {
            statusText = "Uitgespeeld";
        }

        const platformsString = (g.platforms || [])
            .map(p => p.platform.name)
            .join(", ");

        result += `
            <article
                class="w-full max-w-2xl game-card group rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md hover:scale-[1.02] transition duration-300"
                data-title="${g.name}"
                data-description="${g.description}"
                data-rating="${g.rating}"
                data-date="${g.released}"
                data-image="${g.background_image}"
                data-platforms="${platformsString}"
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
    });

    gameCollection.innerHTML = result;
    updateCards();
}

async function updateCollectionPage() {
    renderGames();
    updateCollectionCounter();
    updateCategoryCounts();
}

if (addToCollectionDetailButton && gameTitle) {
    addToCollectionDetailButton.addEventListener("click", async () => {
        const title = gameTitle.textContent.trim();
        addToCollectionHandler(title);
        await updateCollectionPage();

        const collectionBtn = document.getElementById("collectionBtn");
        const collectionStatus = document.getElementById("collectionStatus");
        updateDetailModalUI(title, collectionBtn, collectionStatus);
    });
}

if (setBacklogButton && gameTitle) {
    setBacklogButton.addEventListener("click", async () => {
        const title = gameTitle.textContent.trim();

        collectionTitles = getCollectionTitlesFromLocalStorage();
        collectionStatuses = getCollectionStatusesFromLocalStorage();

        if (!isTitleInCollection(title)) {
            addTitleToCollection(title);
            setCollectionTitlesToLocalStorage();
            setCollectionStatusesToLocalStorage();
        }

        setGameStatus(title, "backlog");
        await updateCollectionPage();

        const collectionBtn = document.getElementById("collectionBtn");
        const collectionStatus = document.getElementById("collectionStatus");
        updateDetailModalUI(title, collectionBtn, collectionStatus);
    });
}

if (setPlayingButton && gameTitle) {
    setPlayingButton.addEventListener("click", async () => {
        const title = gameTitle.textContent.trim();

        collectionTitles = getCollectionTitlesFromLocalStorage();
        collectionStatuses = getCollectionStatusesFromLocalStorage();

        if (!isTitleInCollection(title)) {
            addTitleToCollection(title);
            setCollectionTitlesToLocalStorage();
            setCollectionStatusesToLocalStorage();
        }

        setGameStatus(title, "playing");
        await updateCollectionPage();

        const collectionBtn = document.getElementById("collectionBtn");
        const collectionStatus = document.getElementById("collectionStatus");
        updateDetailModalUI(title, collectionBtn, collectionStatus);
    });
}

if (setFinishedButton && gameTitle) {
    setFinishedButton.addEventListener("click", async () => {
        const title = gameTitle.textContent.trim();

        collectionTitles = getCollectionTitlesFromLocalStorage();
        collectionStatuses = getCollectionStatusesFromLocalStorage();

        if (!isTitleInCollection(title)) {
            addTitleToCollection(title);
            setCollectionTitlesToLocalStorage();
            setCollectionStatusesToLocalStorage();
        }

        setGameStatus(title, "finished");
        await updateCollectionPage();

        const collectionBtn = document.getElementById("collectionBtn");
        const collectionStatus = document.getElementById("collectionStatus");
        updateDetailModalUI(title, collectionBtn, collectionStatus);
    });
}

if (gridViewButton) {
    gridViewButton.addEventListener("click", () => {
        currentView = "grid";
        renderGames();
    });
}

if (listViewButton) {
    listViewButton.addEventListener("click", () => {
        currentView = "list";
        renderGames();
    });
}

if (filterAllButton) {
    filterAllButton.addEventListener("click", () => {
        currentFilter = "all";
        renderGames();
    });
}

if (filterBacklogButton) {
    filterBacklogButton.addEventListener("click", () => {
        currentFilter = "backlog";
        renderGames();
    });
}

if (filterPlayingButton) {
    filterPlayingButton.addEventListener("click", () => {
        currentFilter = "playing";
        renderGames();
    });
}

if (filterFinishedButton) {
    filterFinishedButton.addEventListener("click", () => {
        currentFilter = "finished";
        renderGames();
    });
}

const sortGamesSelect = document.getElementById("sortGames");
if (sortGamesSelect) {
    sortGamesSelect.addEventListener("change", (e) => {
        currentSort = e.target.value;
        renderGames();
    });
}

async function start() {
    games = await loadGames();
    renderGames();
    updateCollectionCounter();
    updateCategoryCounts();
}

start();