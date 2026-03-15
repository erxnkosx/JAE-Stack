function getCurrentGameFromLocalStorage() {
    return JSON.parse(localStorage.getItem("currentGame") || "null");
}

function setCurrentGameToLocalStorage(game) {
    localStorage.setItem("currentGame", JSON.stringify(game));
}

function clearCurrentGameFromLocalStorage() {
    localStorage.removeItem("currentGame");
}

function isCurrentGame(title) {
    const currentGame = getCurrentGameFromLocalStorage();
    return currentGame && currentGame.title === title;
}

function formatCurrentGameStatus(status) {
    if (status === "playing") return "Aan het spelen";
    if (status === "finished") return "Uitgespeeld";
    return "Nog te spelen";
}

function renderCurrentGameBanner() {
    const host = document.getElementById("currentGameBannerHost");
    if (!host) return;

    const currentGame = getCurrentGameFromLocalStorage();

    if (!currentGame) {
        host.innerHTML = "";
        return;
    }

    host.innerHTML = `
      <section class="w-full rounded-2xl border border-cyan-500/30 bg-white/5 backdrop-blur-md px-5 py-4 flex items-center justify-between gap-4">
        <section class="flex items-center gap-4 min-w-0">
          <img
            src="${currentGame.image}"
            alt="${currentGame.title}"
            class="w-16 h-16 rounded-xl object-cover shrink-0"
          />
          <section class="min-w-0">
            <p class="text-xs uppercase tracking-widest text-cyan-400 font-semibold mb-1">
              Actieve game
            </p>
            <h2 class="text-white font-bold text-lg truncate">
              ${currentGame.title}
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
            clearCurrentGameFromLocalStorage();
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