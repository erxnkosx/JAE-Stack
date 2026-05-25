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

function renderPlatforms(platformsData) {
  const container = document.querySelector("#gamePlatforms");

  if (!container) {
    return;
  }

  if (!platformsData || platformsData.length === 0) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = platformsData
      .map(platformInfo => {
        const name = platformInfo.platform.name.toLowerCase();
        let icon;
        let key;

        if (name.startsWith("playstation")) {
          key = "playstation";
          icon = `<svg class="h-6 w-6" fill="#ffffff" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M 12.9375 6 L 12.9375 24.75 L 17 26 L 17 10.34375 C 17 9.929688 17.046875 9.644531 17.21875 9.46875 C 17.390625 9.230469 17.570313 9.210938 17.8125 9.3125 C 18.402344 9.484375 18.65625 9.980469 18.65625 10.84375 L 18.65625 17.15625 C 19.972656 17.777344 21.167969 17.84375 22.03125 17.1875 C 22.933594 16.566406 23.40625 15.441406 23.40625 13.78125 C 23.40625 12.054688 23.078125 10.742188 22.3125 9.875 C 21.621094 8.941406 20.398438 8.183594 18.59375 7.5625 C 16.34375 6.835938 14.460938 6.320313 12.9375 6 Z M 11.6875 17.34375 L 10.875 17.59375 L 5.84375 19.40625 L 4.96875 19.75 C 3.652344 20.304688 2.964844 20.886719 3 21.40625 C 3.070313 22.167969 3.941406 22.710938 5.5 23.125 C 7.523438 23.671875 9.585938 23.78125 11.6875 23.46875 L 11.6875 21.34375 L 10.875 21.65625 L 10 22 L 8.53125 22.28125 L 7.15625 22.09375 C 6.878906 21.917969 6.824219 21.734375 7 21.5625 C 7.171875 21.457031 7.410156 21.324219 7.6875 21.21875 L 8.625 20.875 L 11.6875 19.8125 Z M 23.34375 18.34375 C 22.96875 18.328125 22.582031 18.355469 22.21875 18.375 C 20.871094 18.402344 19.5 18.640625 18.0625 19.09375 L 18.0625 21.59375 L 20.90625 20.59375 L 22.375 20.09375 C 22.375 20.09375 22.9375 19.949219 23.34375 19.84375 C 23.964844 19.679688 24.625 19.90625 24.625 19.90625 C 25.003906 19.941406 25.179688 20.074219 25.25 20.25 C 25.320313 20.457031 25.082031 20.636719 24.5625 20.8125 L 23.28125 21.3125 L 18.0625 23.1875 L 18.0625 25.625 L 20.5 24.75 L 26.34375 22.6875 L 27.0625 22.375 C 28.449219 21.855469 29.070313 21.285156 29 20.59375 C 28.964844 19.933594 28.199219 19.417969 26.8125 18.96875 C 25.644531 18.578125 24.46875 18.386719 23.34375 18.34375 Z"></path></svg>`;
        } else if (name.startsWith("xbox")) {
          key = "xbox";
          icon = `<svg class="h-6 w-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#ffffff"><path fill="none" d="M0 0h24v24H0z"></path><path fill-rule="nonzero" d="M5.418 19.527A9.956 9.956 0 0 0 12 22a9.967 9.967 0 0 0 6.585-2.473c1.564-1.593-3.597-7.257-6.585-9.514-2.985 2.257-8.15 7.921-6.582 9.514zm9.3-12.005c2.084 2.468 6.237 8.595 5.064 10.76A9.952 9.952 0 0 0 22 12.003a9.958 9.958 0 0 0-2.975-7.113s-.022-.018-.068-.035a.686.686 0 0 0-.235-.038c-.493 0-1.654.362-4.004 2.705zM5.045 4.856c-.048.017-.068.034-.072.035A9.963 9.963 0 0 0 2 12.003c0 2.379.832 4.561 2.218 6.278C3.05 16.11 7.2 9.988 9.284 7.523 6.934 5.178 5.771 4.818 5.28 4.818a.604.604 0 0 0-.234.039v-.002zM12 4.959S9.546 3.523 7.63 3.455c-.753-.027-1.212.246-1.268.282C8.149 2.538 10.049 2 11.987 2H12c1.945 0 3.838.538 5.638 1.737-.056-.038-.512-.31-1.266-.282-1.917.068-4.372 1.5-4.372 1.5v.004z"></path></svg>`;
        } else if (name === "pc") {
          key = "pc";
          icon = `<svg class="h-6 w-6" fill="#ffffff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m8.214 17.315-1.236-.512a2.13 2.13 0 0 0 1.101 1.051 2.141 2.141 0 0 0 2.798-1.155c.22-.527.221-1.111.003-1.639a2.123 2.123 0 0 0-1.155-1.162 2.128 2.128 0 0 0-1.578-.024l1.278.53a1.578 1.578 0 0 1 .848 2.063 1.574 1.574 0 0 1-2.059.848z"></path><path d="M11.979 2C6.679 2 2.342 6.123 2 11.336l.004.007v-.001l5.373 2.212a2.747 2.747 0 0 1 1.639-.454l2.447-3.555-.001-.049a3.805 3.805 0 0 1 3.798-3.804 3.805 3.805 0 1 1-.086 7.608l-3.501 2.502a2.774 2.774 0 0 1-3.84 2.636 2.77 2.77 0 0 1-1.638-1.96L2.41 14.916C3.66 19.017 7.47 22 11.979 22c5.523 0 10-4.477 10-10s-4.478-10-10-10z"></path><path d="M17.793 9.495a2.537 2.537 0 0 0-2.531-2.535 2.536 2.536 0 0 0 0 5.07 2.535 2.535 0 0 0 2.531-2.535zm-4.427-.003c0-1.052.852-1.905 1.9-1.905 1.05 0 1.901.853 1.901 1.905a1.902 1.902 0 0 1-1.901 1.904c-1.049 0-1.9-.853-1.9-1.904z"></path></svg>`;
        } else {
          key = name;
          icon = `<span class="text-sm text-slate-200">${platformInfo.platform.name}</span>`;
        }

        return { key, icon };
      })
      .filter((item, index, arr) => arr.findIndex(other => other.key === item.key) === index)
      .map(item => `
            <span class="rounded-full bg-white/10 px-5 py-3 text-lg text-slate-200 flex justify-center items-center">
                ${item.icon}
            </span>
        `)
      .join("");
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
    container.className = "mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8";
  } else {
    container.className = "mt-6 flex flex-col gap-8 w-full";
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

async function openGameDetails(card) {
  currentRawgId = Number(card.dataset.rawgId);

  document.querySelector("#gameTitle").textContent = card.dataset.title;
  document.querySelector("#gameDescription").textContent = card.dataset.description;
  document.querySelector("#gameRating").textContent = card.dataset.rating;
  document.querySelector("#gameDate").textContent = card.dataset.date;

  const cover = document.querySelector("#gameCover");
  cover.src = card.dataset.image;
  cover.alt = card.dataset.title;

  renderPlatforms([]);

  document.querySelector("#gameDetails").classList.remove("hidden");
  document.querySelector("#gameDetails").classList.add("flex");

  updateCollectionUI();

  try {
    const response = await fetch(`/ontdek/game/${currentRawgId}`);

    if (response.ok) {
      const game = await response.json();
      renderPlatforms(game.platforms);
    }
  } catch (error) {
    console.error("Kon platformen niet laden:", error);
  }
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
    collectionStatus.className = "inline-block rounded-full px-4 py-2 text-sm font-semibold bg-red-600 text-white";

    collectionBtn.textContent = "Voeg toe aan collectie";
    collectionBtn.className = "w-full rounded-xl px-6 py-3.5 text-base font-semibold text-white transition bg-green-600 hover:bg-green-700";

    return;
  }

  collectionStatus.textContent = statusText[game.status];
  collectionStatus.className = `inline-block rounded-full px-4 py-2 text-sm font-semibold ${statusBadgeColors[game.status]} text-white`;

  collectionBtn.textContent = "Verwijder uit collectie";
  collectionBtn.className = "w-full rounded-xl px-6 py-3.5 text-base font-semibold text-white transition bg-red-600 hover:bg-red-700";
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

function updateFilterButtons() {
  const filterIds = { all: "filterAll", backlog: "filterBacklog", playing: "filterPlaying", finished: "filterFinished" };
  Object.values(filterIds).forEach(id => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.classList.remove("text-cyan-400", "border-cyan-400");
    btn.classList.add("text-slate-400", "border-gray-800");
  });
  const activeBtn = document.getElementById(filterIds[currentFilter]);
  if (activeBtn) {
    activeBtn.classList.remove("text-slate-400", "border-gray-800");
    activeBtn.classList.add("text-cyan-400", "border-cyan-400");
  }
}

function updateViewButtons() {
  const ids = { grid: "gridView", list: "listView" };
  Object.values(ids).forEach(id => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.classList.remove("bg-cyan-500/20", "text-cyan-400");
    btn.classList.add("text-slate-500", "hover:text-gray-300");
  });
  const activeBtn = document.getElementById(ids[currentView]);
  if (activeBtn) {
    activeBtn.classList.remove("text-slate-500", "hover:text-gray-300");
    activeBtn.classList.add("bg-cyan-500/20", "text-cyan-400");
  }
}

function setupEventListeners() {
  document.getElementById("collectionBtn")?.addEventListener("click", toggleCollection);

  document.getElementById("setBacklog")?.addEventListener("click", () => changeStatus("backlog"));
  document.getElementById("setPlaying")?.addEventListener("click", () => changeStatus("playing"));
  document.getElementById("setFinished")?.addEventListener("click", () => changeStatus("finished"));

  document.getElementById("gridView")?.addEventListener("click", () => {
    currentView = "grid";
    updateViewButtons();
    renderGames();
  });

  document.getElementById("listView")?.addEventListener("click", () => {
    currentView = "list";
    updateViewButtons();
    renderGames();
  });

  document.getElementById("filterAll")?.addEventListener("click", () => {
    currentFilter = "all";
    updateFilterButtons();
    renderGames();
  });

  document.getElementById("filterBacklog")?.addEventListener("click", () => {
    currentFilter = "backlog";
    updateFilterButtons();
    renderGames();
  });

  document.getElementById("filterPlaying")?.addEventListener("click", () => {
    currentFilter = "playing";
    updateFilterButtons();
    renderGames();
  });

  document.getElementById("filterFinished")?.addEventListener("click", () => {
    currentFilter = "finished";
    updateFilterButtons();
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
updateFilterButtons();
updateViewButtons();
await renderGames();