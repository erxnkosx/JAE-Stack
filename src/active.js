const setPLayingBtn = document.getElementById("setPlaying");

function getCollectionGamesFromLocalStorage() {
    return JSON.parse(localStorage.getItem("collectionGames") || "[]");
}

function setCollectionGamesToLocalStorage(collectionGames) {
    localStorage.setItem("collectionGames", JSON.stringify(collectionGames));
}

function getCollectionStatusesFromLocalStorage() {
    return JSON.parse(localStorage.getItem("collectionStatuses") || "{}");
}

function setCollectionStatusesToLocalStorage(collectionStatuses) {
    localStorage.setItem("collectionStatuses", JSON.stringify(collectionStatuses));
}

function getCurrentGame() {
    const games = getCollectionGamesFromLocalStorage();
    const statuses = getCollectionStatusesFromLocalStorage();

    return games.find(game => statuses[game.name] === "playing") || null;
}

function formatCurrentGameStatus(status) {
    if (status === "playing") return "Aan het spelen";
    if (status === "finished") return "Uitgespeeld";
    return "Nog te spelen";
}

function renderCurrentGameBanner() {
    const host = document.getElementById("currentGameBanner");
    if (!host) return;

    const currentGame = getCurrentGame();

    if (!currentGame) {
        host.innerHTML = "";
        return;
    }

    host.innerHTML = `
      <section class="w-full rounded-2xl border border-cyan-500/30 bg-white/5 backdrop-blur-md px-5 py-4 flex items-center justify-between gap-4">
        <section class="flex items-center gap-4 min-w-0">
          <img
            src="${currentGame.background_image}"
            alt="${currentGame.name}"
            class="w-16 h-16 rounded-xl object-cover shrink-0"
          />
          <section class="min-w-0">
            <p class="text-xs uppercase text-cyan-400 font-semibold mb-1">
              Actieve game
            </p>
            <h2 class="text-white font-bold text-lg">
              ${currentGame.name}
            </h2>
            <p class="text-slate-400 text-sm">
              Status: ${formatCurrentGameStatus(currentGame.status)}
            </p>
          </section>
        </section>

        <section class="flex items-center gap-3 shrink-0">
          <button
            id="clearCurrentGameBtn"
            class="px-4 py-2 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 hover:bg-red-500/25 transition text-sm font-semibold"
          >
            Verwijderen
          </button>
        </section>
      </section>
    `;

    const clearBtn = document.getElementById("clearCurrentGameBtn");

    if (clearBtn) {
        clearBtn.onclick = () => {
            const games = getCollectionGamesFromLocalStorage();
            const statuses = getCollectionStatusesFromLocalStorage();

            const updatedGames = games.map(game =>
                game.status === "playing"
                    ? { ...game, status: "backlog" }
                    : game
            );

            Object.keys(statuses).forEach(title => {
                if (statuses[title] === "playing") {
                    statuses[title] = "backlog";
                }
            });

            setCollectionGamesToLocalStorage(updatedGames);
            setCollectionStatusesToLocalStorage(statuses);

            renderCurrentGameBanner();
        };
    }
}

document.addEventListener("DOMContentLoaded", () => {
    renderCurrentGameBanner();
});

window.addEventListener("storage", () => {
    renderCurrentGameBanner();
});

setPLayingBtn.addEventListener("click", renderCurrentGameBanner);