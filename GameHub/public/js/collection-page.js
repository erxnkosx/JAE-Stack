let currentRawgId = null;
let currentView = "grid";
let currentSort = "rating";
let currentFilter = "all";

async function fetchCollection() {
  const res = await fetch("/collection/api");
  if (!res.ok) return [];
  return await res.json();
}

async function renderGames() {
  const gameCollection = document.getElementById("gameCollection");
  if (!gameCollection) return;

  let collection = await fetchCollection();

  const all = collection.length;
  document.getElementById("countAll").textContent = all;
  document.getElementById("countBacklog").textContent = collection.filter(g => g.status === "backlog").length;
  document.getElementById("countPlaying").textContent = collection.filter(g => g.status === "playing").length;
  document.getElementById("countFinished").textContent = collection.filter(g => g.status === "finished").length;
  document.getElementById("collectionCounter").textContent = all;

  if (currentFilter !== "all") {
    collection = collection.filter(g => g.status === currentFilter);
  }

  if (currentSort === "rating") collection.sort((a, b) => b.rating - a.rating);
  if (currentSort === "released") collection.sort((a, b) => new Date(b.released) - new Date(a.released));
  if (currentSort === "name") collection.sort((a, b) => a.title.localeCompare(b.title));

  if (collection.length === 0) {
    gameCollection.innerHTML = `<p class="text-slate-500">Geen games in deze categorie</p>`;
    return;
  }

  gameCollection.className = currentView === "grid"
    ? "mt-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
    : "mt-6 flex flex-col gap-8 items-center w-full";

  gameCollection.innerHTML = collection.map(g => {
    const statusText = g.status === "playing" ? "Aan het spelen" : g.status === "finished" ? "Uitgespeeld" : "Nog te spelen";
    return `
      <article class="w-full game-card group rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md hover:scale-[1.02] transition duration-300"
        data-rawg-id="${g.rawg_id}" data-title="${g.title}" data-description="${g.description}"
        data-rating="${g.rating}" data-date="${g.released}" data-image="${g.background_image}">
        <section class="relative">
          <img src="${g.background_image}" alt="${g.title}" class="w-full h-[420px] object-cover"/>
          <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
          <span class="absolute top-4 left-4 flex items-center gap-2 bg-zinc-900/80 text-yellow-400 px-4 py-2 rounded-2xl text-lg font-bold">⭐ ${g.rating}</span>
        </section>
        <section class="p-6">
          <div class="flex items-center justify-between gap-4 mb-2">
            <h3 class="text-2xl font-bold text-white">${g.title}</h3>
            <span class="text-xs px-2 py-1 rounded-full whitespace-nowrap ${g.status === 'playing' ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20' : g.status === 'finished' ? 'bg-green-500/10 text-green-300 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-300 border border-yellow-500/20'}">${statusText}</span>
          </div>
          <p class="text-slate-300 text-sm leading-relaxed mb-3">${g.description}</p>
          <p class="text-slate-400">${g.released}</p>
        </section>
      </article>
    `;
  }).join("");

  document.querySelectorAll(".game-card").forEach(card => {
    card.onclick = async () => {
      currentRawgId = parseInt(card.dataset.rawgId);
      document.querySelector("#gameTitle").textContent = card.dataset.title;
      document.querySelector("#gameDescription").textContent = card.dataset.description;
      document.querySelector("#gameRating").textContent = card.dataset.rating;
      document.querySelector("#gameDate").textContent = card.dataset.date;
      document.querySelector("#gameCover").src = card.dataset.image;
      document.querySelector("#gameCover").alt = card.dataset.title;
      await updateCollectionUI();
      document.querySelector("#gameDetails").classList.remove("hidden");
      document.querySelector("#gameDetails").classList.add("flex");
    };
  });
}

async function updateCollectionUI() {
  const collection = await fetchCollection();
  const game = collection.find(g => g.rawg_id === currentRawgId);

  const collectionBtn = document.getElementById("collectionBtn");
  const collectionStatus = document.getElementById("collectionStatus");

  if (!game) {
    collectionStatus.textContent = "Niet in collectie";
    collectionStatus.className = "rounded-full px-4 py-2 text-sm font-semibold bg-red-600 text-white";
    collectionBtn.textContent = "Voeg toe aan collectie";
    collectionBtn.className = "w-fit min-w-[320px] rounded-xl px-8 py-4 text-xl font-semibold text-white transition bg-green-600 hover:bg-green-700";
    return;
  }

  const statusLabels = { backlog: "Nog te spelen", playing: "Aan het spelen", finished: "Uitgespeeld" };
  const statusColors = { backlog: "bg-yellow-600", playing: "bg-cyan-600", finished: "bg-green-600" };

  collectionStatus.textContent = statusLabels[game.status];
  collectionStatus.className = `rounded-full px-4 py-2 text-sm font-semibold ${statusColors[game.status]} text-white`;
  collectionBtn.textContent = "Verwijder uit collectie";
  collectionBtn.className = "w-fit min-w-[320px] rounded-xl px-8 py-4 text-xl font-semibold text-white transition bg-red-600 hover:bg-red-700";
}

document.getElementById("collectionBtn")?.addEventListener("click", async () => {
  if (!currentRawgId) return;
  const collection = await fetchCollection();
  const inCollection = collection.some(g => g.rawg_id === currentRawgId);

  if (inCollection) {
    if (!confirm("Weet je zeker dat je deze game wilt verwijderen?")) return;
    await fetch(`/collection/api/${currentRawgId}`, { method: "DELETE" });
  } else {
    const nickname = prompt("Geef een bijnaam voor deze game (optioneel):");
    await fetch("/collection/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
  await renderGames();
  await updateCollectionUI();
});

async function changeStatus(status) {
  if (!currentRawgId) return;
  await fetch(`/collection/api/${currentRawgId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });
  await renderGames();
  await updateCollectionUI();
}

document.getElementById("setBacklog")?.addEventListener("click", () => changeStatus("backlog"));
document.getElementById("setPlaying")?.addEventListener("click", () => changeStatus("playing"));
document.getElementById("setFinished")?.addEventListener("click", () => changeStatus("finished"));

document.getElementById("gridView")?.addEventListener("click", () => { currentView = "grid"; renderGames(); });
document.getElementById("listView")?.addEventListener("click", () => { currentView = "list"; renderGames(); });

document.getElementById("filterAll")?.addEventListener("click", () => { currentFilter = "all"; renderGames(); });
document.getElementById("filterBacklog")?.addEventListener("click", () => { currentFilter = "backlog"; renderGames(); });
document.getElementById("filterPlaying")?.addEventListener("click", () => { currentFilter = "playing"; renderGames(); });
document.getElementById("filterFinished")?.addEventListener("click", () => { currentFilter = "finished"; renderGames(); });

document.getElementById("sortGames")?.addEventListener("change", e => { currentSort = e.target.value; renderGames(); });

document.querySelector("#closeGameDetails")?.addEventListener("click", () => {
  document.querySelector("#gameDetails").classList.add("hidden");
  document.querySelector("#gameDetails").classList.remove("flex");
});

document.querySelector("#gameDetails")?.addEventListener("click", e => {
  if (e.target === document.querySelector("#gameDetails")) {
    document.querySelector("#gameDetails").classList.add("hidden");
    document.querySelector("#gameDetails").classList.remove("flex");
  }
});

renderGames();