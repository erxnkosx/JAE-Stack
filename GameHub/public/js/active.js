async function getCurrentGame() {
    const res = await fetch("/collection/api");
    if (!res.ok) return null;
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
      <section id="verwijderModal" style="display:none;" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/70">
          <div class="bg-zinc-900 border border-white/10 rounded-2xl p-6 max-w-md mx-4">
              <p class="text-white mb-5">Weet je zeker dat je deze game wilt verwijderen?</p>
              <div class="flex gap-2 justify-center">
                  <button onclick="closeVerwijder()" class="px-4 py-2 rounded-xl text-sm bg-white/5 text-slate-300">Annuleren</button>
                  <button onclick="confirmDelete()" class="px-4 py-2 rounded-xl text-sm bg-red-600/20 text-red-400">Verwijderen</button>
              </div>
          </div>
      </section>
    `;

  document.getElementById("clearCurrentGameBtn").onclick = () => {
    document.getElementById('verwijderModal').style.display = 'flex';
  };

  window.confirmDelete = async function () {
    document.getElementById('verwijderModal').style.display = 'none';

    await fetch(`/collection/api/${currentGame.rawg_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "backlog" })
    });

    await renderCurrentGameBanner();
  }

  window.closeVerwijder = function () {
  document.getElementById('verwijderModal').style.display = 'none';
}
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
