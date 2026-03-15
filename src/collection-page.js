function updateCards() {
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

const gameCollection = document.getElementById("gameCollection");
const addToCollectionDetailButton = document.getElementById("verlanglijstGameDetails");
const gameTitle = document.getElementById("gameTitle");

const listViewButton = document.getElementById("listView");
const gridViewButton = document.getElementById("gridView");

let currentView = "grid";
let currentSort = "rating"; // of "released"

function getCollectionTitlesFromLocalStorage() {
    return JSON.parse(localStorage.getItem("collectionTitles") || "[]");
}

function setCollectionTitlesToLocalStorage() {
    localStorage.setItem("collectionTitles", JSON.stringify(collectionTitles));
}

function isTitleInCollection(title) {
    return collectionTitles.includes(title);
}

function removeTitleFromCollection(title) {
    collectionTitles = collectionTitles.filter(colTitle => colTitle !== title);
}

function addTitleToCollection(title) {
    collectionTitles.push(title);
}

function addToCollectionHandler(title) {
    collectionTitles = getCollectionTitlesFromLocalStorage();

    if (isTitleInCollection(title)) {
        removeTitleFromCollection(title);
    } else {
        addTitleToCollection(title);
    }

    setCollectionTitlesToLocalStorage();
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
    console.log(sortedGames)
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

function renderGames() {
    collectionTitles = getCollectionTitlesFromLocalStorage();

    const collectionGames = games.filter(game => collectionTitles.includes(game.name));
    const sortedCollectionGames = sortGames(collectionGames, currentSort);

    if (sortedCollectionGames.length === 0) {
        noGames();
        return;
    }

    applyViewClass();

    let result = "";

    sortedCollectionGames.forEach(g => {
        result += `
            <article
                class="w-full max-w-2xl game-card group rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md hover:scale-[1.02] transition duration-300"
                data-title="${g.name}"
                data-description="${g.description}"
                data-rating="${g.rating}"
                data-date="${g.released}"
                data-image="${g.background_image}"
                data-platforms="PC, PlayStation 4, Xbox One"
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
                    <h3 class="text-2xl font-bold text-white mb-2">${g.name}</h3>
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
}

if (addToCollectionDetailButton && gameTitle) {
    addToCollectionDetailButton.addEventListener("click", async () => {
        addToCollectionHandler(gameTitle.textContent.trim());
        await updateCollectionPage();
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
const sortGamesSelect = document.getElementById("sortGames");
    sortGamesSelect.addEventListener("change", (e) => {
        currentSort = e.target.value;
        renderGames();
    });


const collectionCounter = document.getElementById("collectionCounter");
function updateCollectionCounter() {
    collectionCounter.textContent = collectionTitles.length;
}

async function start() {
    games = await loadGames();
    renderGames();
    updateCollectionCounter();
}

start();