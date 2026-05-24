let currentRawgId = null;
let currentView = "grid";
let currentSort = "rating";
let currentFilter = "all";
let onlyFiveStars = false;

const statusText = {
  backlog: "Nog te spelen",
  playing: "Aan het spelen",
  finished: "Uitgespeeld"
};

const statusClasses = {
  backlog: "bg-yellow-500/10 text-yellow-300 border border-yellow-500/20",
  playing: "bg-cyan-500/10 text-cyan-300 border border-cyan-500/20",
  finished: "bg-green-500/10 text-green-300 border border-green-500/20"
};

const statusBadgeColors = {
  backlog: "bg-yellow-600",
  playing: "bg-cyan-600",
  finished: "bg-green-600"
};

async function fetchCollection() {
  const response = await fetch("/collection/api");

  if (!response.ok) {
    return [];
  }

  return await response.json();
}

function updateCounters(collection) {
  document.getElementById("countAll").textContent = collection.length;
  document.getElementById("countBacklog").textContent = collection.filter(game => game.status === "backlog").length;
  document.getElementById("countPlaying").textContent = collection.filter(game => game.status === "playing").length;
  document.getElementById("countFinished").textContent = collection.filter(game => game.status === "finished").length;
  document.getElementById("collectionCounter").textContent = collection.length;
}

function filterCollection(collection) {
  let filtered = collection;

  if (currentFilter !== "all") {
    filtered = filtered.filter(game => game.status === currentFilter);
  }

  if (onlyFiveStars) {
    filtered = filtered.filter(game => game.rating >= 4.80);
  }

  return filtered;
}

function sortCollection(collection) {
  if (currentSort === "rating") {
    return collection.sort((a, b) => b.rating - a.rating);
  }

  if (currentSort === "released") {
    return collection.sort((a, b) => new Date(b.released) - new Date(a.released));
  }

  if (currentSort === "name") {
    return collection.sort((a, b) => a.title.localeCompare(b.title));
  }

  return collection;
}

function setCollectionLayout(container) {
  if (currentView === "grid") {
    container.className = "max-w-7xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8";
  } else {
    container.className = "max-w-7xl mx-auto mt-6 flex flex-col gap-8 items-center w-full";
  }
}

function createGameCard(game) {
  return `
        <article 
            class="w-full game-card group rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md hover:scale-[1.02] transition duration-300"
            data-rawg-id="${game.rawg_id}"
            data-title="${game.title}"
            data-description="${game.description}"
            data-rating="${game.rating}"
            data-date="${game.released}"
            data-image="${game.background_image}"
        >
            <section class="relative">
                <img 
                    loading="lazy"
                    src="${game.background_image}" 
                    alt="${game.title}" 
                    class="w-full h-[420px] object-cover"
                >

                <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

                <span class="absolute top-4 left-4 flex items-center gap-2 bg-zinc-900/80 text-yellow-400 px-4 py-2 rounded-2xl text-lg font-bold">
                    ⭐ ${game.rating}
                </span>

                <span class="absolute top-4 right-4 text-xs px-3 py-2 rounded-2xl whitespace-nowrap ${statusClasses[game.status]} backdrop-blur-md">
                    ${statusText[game.status]}
                </span>
            </section>

            <section class="p-6">
                <h3 class="text-2xl font-bold text-white mb-2">${game.title.split(" ").length > 3 ? game.title.split(" ").slice(0, 3).join(" ") + " ..." : game.title}</h3>


                <p class="text-slate-300 text-sm leading-relaxed mb-3">
                    ${game.description ? game.description.substring(0, 30) + "..." : "Geen beschrijving beschikbaar."}
                </p>

                <p class="text-slate-400">
                    ${game.released}
                </p>
            </section>
        </article>
    `;
}

function openGameDetails(card) {
  currentRawgId = Number(card.dataset.rawgId);

  document.querySelector("#gameTitle").textContent = card.dataset.title;
  document.querySelector("#gameDescription").textContent = card.dataset.description;
  document.querySelector("#gameRating").textContent = card.dataset.rating;
  document.querySelector("#gameDate").textContent = card.dataset.date;

  const cover = document.querySelector("#gameCover");
  cover.src = card.dataset.image;
  cover.alt = card.dataset.title;

  document.querySelector("#gameDetails").classList.remove("hidden");
  document.querySelector("#gameDetails").classList.add("flex");

  updateCollectionUI();
}

function addCardClickEvents() {
  document.querySelectorAll(".game-card").forEach(card => {
    card.addEventListener("click", () => openGameDetails(card));
  });
}

async function renderGames() {
  const gameCollection = document.getElementById("gameCollection");

  if (!gameCollection) {
    return;
  }

  const collection = await fetchCollection();

  updateCounters(collection);

  let visibleGames = filterCollection(collection);
  visibleGames = sortCollection(visibleGames);

  if (visibleGames.length === 0) {
    gameCollection.innerHTML = `<p class="text-slate-500">Geen games in deze categorie</p>`;
    return;
  }

  setCollectionLayout(gameCollection);

  gameCollection.innerHTML = visibleGames
      .map(game => createGameCard(game))
      .join("");

  addCardClickEvents();
}

async function updateCollectionUI() {
  const collection = await fetchCollection();
  const game = collection.find(game => game.rawg_id === currentRawgId);

  const collectionBtn = document.getElementById("collectionBtn");
  const collectionStatus = document.getElementById("collectionStatus");

  if (!game) {
    collectionStatus.textContent = "Niet in collectie";
    collectionBtn.className = "w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition bg-green-600 hover:bg-green-700";

    collectionBtn.textContent = "Voeg toe aan collectie";
    collectionBtn.className = "w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition bg-red-600 hover:bg-red-700";

    return;
  }

  collectionStatus.textContent = statusText[game.status];
  collectionStatus.className = `rounded-full px-4 py-2 text-sm font-semibold ${statusBadgeColors[game.status]} text-white`;

  collectionBtn.textContent = "Verwijder uit collectie";
  collectionBtn.className = "w-fit min-w-[320px] rounded-xl px-8 py-4 text-xl font-semibold text-white transition bg-red-600 hover:bg-red-700";
}

async function addGameToCollection() {
  const nickname = prompt("Geef een bijnaam voor deze game (optioneel):");

  await fetch("/collection/api", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      rawg_id: currentRawgId,
      title: document.querySelector("#gameTitle").textContent,
      nickname: nickname || "",
      status: "backlog",
      background_image: document.querySelector("#gameCover").src,
      rating: document.querySelector("#gameRating").textContent,
      released: document.querySelector("#gameDate").textContent,
      description: document.querySelector("#gameDescription").textContent
    })
  });
}

window.closeVerwijder = async function() {
    document.getElementById('verwijderModal').style.display = 'none';
}

window.confirmDelete = async function() {
    document.getElementById('verwijderModal').style.display = 'none';
    await fetch(`/collection/api/${currentRawgId}`, { method: "DELETE" });
    await renderGames();
    await updateCollectionUI();
}

async function toggleCollection() {
  if (!currentRawgId) {
    return;
  }

  const collection = await fetchCollection();
  const gameExists = collection.some(game => game.rawg_id === currentRawgId);

  if (gameExists) {
    document.getElementById('verwijderModal').style.display = 'flex';
  } else {
    await addGameToCollection();
  }

  await renderGames();
  await updateCollectionUI();
}

async function changeStatus(status) {
  if (!currentRawgId) {
    return;
  }

  await fetch(`/collection/api/${currentRawgId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ status })
  });

  await renderGames();
  await updateCollectionUI();
}

function closeGameDetails() {
  document.querySelector("#gameDetails").classList.add("hidden");
  document.querySelector("#gameDetails").classList.remove("flex");
}

function setupEventListeners() {
  document.getElementById("collectionBtn")?.addEventListener("click", toggleCollection);

  document.getElementById("setBacklog")?.addEventListener("click", () => changeStatus("backlog"));
  document.getElementById("setPlaying")?.addEventListener("click", () => changeStatus("playing"));
  document.getElementById("setFinished")?.addEventListener("click", () => changeStatus("finished"));

  document.getElementById("gridView")?.addEventListener("click", () => {
    currentView = "grid";
    renderGames();
  });

  document.getElementById("listView")?.addEventListener("click", () => {
    currentView = "list";
    renderGames();
  });

  document.getElementById("filterAll")?.addEventListener("click", () => {
    currentFilter = "all";
    renderGames();
  });

  document.getElementById("filterBacklog")?.addEventListener("click", () => {
    currentFilter = "backlog";
    renderGames();
  });

  document.getElementById("filterPlaying")?.addEventListener("click", () => {
    currentFilter = "playing";
    renderGames();
  });

  document.getElementById("filterFinished")?.addEventListener("click", () => {
    currentFilter = "finished";
    renderGames();
  });

  document.getElementById("sortGames")?.addEventListener("change", event => {
    currentSort = event.target.value;
    renderGames();
  });
  
  document.getElementById("showAllGames")?.addEventListener("change", event => {
    onlyFiveStars = event.target.checked;
    renderGames();
  });

  document.querySelector("#closeGameDetails")?.addEventListener("click", closeGameDetails);

  document.querySelector("#gameDetails")?.addEventListener("click", event => {
    if (event.target === document.querySelector("#gameDetails")) {
      closeGameDetails();
    }
  });
}

setupEventListeners();
await renderGames();