let currentRawgId = null;

async function fetchCollection() {
  const res = await fetch("/collection/api");
  if (!res.ok) return [];
  return await res.json();
}

async function updateCollectionUI() {
  const collection = await fetchCollection();
  const game = collection.find(g => g.rawg_id === currentRawgId);

  const collectionBtn = document.querySelector("#collectionBtn");
  const collectionStatus = document.querySelector("#collectionStatus");

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

document.querySelectorAll(".game-card").forEach(card => {
  card.onclick = async () => {
    currentRawgId = parseInt(card.dataset.id);

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

document.querySelector("#collectionBtn").onclick = async () => {
  if (!currentRawgId) return;

  const collection = await fetchCollection();
  const inCollection = collection.some(g => g.rawg_id === currentRawgId);

  if (inCollection) {
    if (!confirm("Weet je zeker dat je deze game wilt verwijderen uit je collectie?")) return;
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
  await updateCollectionUI();
};

async function changeStatus(status) {
  if (!currentRawgId) return;
  await fetch(`/collection/api/${currentRawgId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });
  await updateCollectionUI();
}

document.getElementById("setBacklog")?.addEventListener("click", () => changeStatus("backlog"));
document.getElementById("setPlaying")?.addEventListener("click", () => changeStatus("playing"));
document.getElementById("setFinished")?.addEventListener("click", () => changeStatus("finished"));

const gameSearch = document.getElementById("gameSearch");
const suggestions = document.getElementById("suggestions");

gameSearch.addEventListener("input", e => {
  const input = e.target.value;
  suggestions.innerHTML = "";
  suggestions.classList.add("hidden");

  if (input.length <= 1) {
    document.querySelectorAll(".game-card").forEach(c => c.classList.remove("hidden"));
    return;
  }

  const results = Array.from(document.querySelectorAll(".game-card"))
    .filter(card => card.dataset.title.toLowerCase().startsWith(input.toLowerCase()));

  if (results.length > 0) {
    suggestions.classList.remove("hidden");
    suggestions.innerHTML = results.map(c => `
      <div class="suggestion hover:bg-white/10 text-white px-4 py-3 cursor-pointer">${c.dataset.title}</div>
    `).join("");

    document.querySelectorAll(".suggestion").forEach(s => {
      s.addEventListener("click", () => {
        gameSearch.value = s.innerText.trim();
        suggestions.classList.add("hidden");
        document.querySelectorAll(".game-card").forEach(c => {
          c.classList.toggle("hidden", c.dataset.title.toLowerCase() !== s.innerText.trim().toLowerCase());
        });
      });
    });
  }
});

gameSearch.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    const val = gameSearch.value.trim();
    suggestions.classList.add("hidden");
    document.querySelectorAll(".game-card").forEach(c => {
      c.classList.toggle("hidden", val.length > 0 && c.dataset.title.toLowerCase() !== val.toLowerCase());
    });
  }
});
