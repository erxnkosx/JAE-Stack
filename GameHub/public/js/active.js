async function getCurrentGame() {
    const res = await fetch("/collection/api");
    const collection = await res.json();
    return collection.find(g => g.status === "playing") || null;
}

async function renderCurrentGameBanner() {
    const currentGameBanner = document.getElementById("currentGameBanner");
    if (!currentGameBanner) return;

    const currentGame = await getCurrentGame();

    if (!currentGame) {
        currentGameBanner.innerHTML = "";
        return;
    }

    currentGameBanner.innerHTML = `
      <section class="w-full rounded-2xl border border-cyan-500/30 bg-white/5 backdrop-blur-md px-5 py-4 flex items-center justify-between gap-4">
        <section class="flex items-center gap-4 min-w-0">
          <img
            src="${currentGame.background_image}"
            alt="${currentGame.title}"
            class="w-16 h-16 rounded-xl object-cover shrink-0"
          />
          <section class="min-w-0">
            <p class="text-xs uppercase text-cyan-400 font-semibold mb-1">Actieve game</p>
            <h2 class="text-white font-bold text-lg">${currentGame.title}</h2>
            <p class="text-slate-400 text-sm">Status: Aan het spelen</p>
          </section>
        </section>
        <button
          id="clearCurrentGameBtn"
          class="px-4 py-2 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 hover:bg-red-500/25 transition text-sm font-semibold shrink-0"
        >
          Verwijderen
        </button>
      </section>
    `;

    document.getElementById("clearCurrentGameBtn").onclick = async () => {
        await fetch(`/collection/api/${currentGame.rawg_id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "backlog" })
        });
        await renderCurrentGameBanner();
    };
}

document.addEventListener("DOMContentLoaded", () => {
    renderCurrentGameBanner();
});

const setPlayingBtn = document.getElementById("setPlaying");
if (setPlayingBtn) {
    setPlayingBtn.addEventListener("click", () => {
        setTimeout(renderCurrentGameBanner, 300);
    });
}
