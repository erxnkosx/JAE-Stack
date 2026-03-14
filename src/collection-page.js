let games;
let collectionIds = getCollectionIdsFromLocalStorage();
const gameCollection = document.getElementById("#gameCollection");
console.log(collectionIds);
const loadGames = async () => {
    const response = await fetch("../data/details.json");
    return await response.json();
};

function getCollectionIdsFromLocalStorage() {
    return JSON.parse(localStorage.getItem("collectionIds") || "[]");
}

async function showGames() {
    const games = await loadGames();
    let result = '';
    gameCollection.classList = "mt-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8";
    games.filter(game => collectionIds.includes(String(game.id))).forEach(g => {
        result += `<article
        class="game-card group rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md hover:scale-[1.02] transition duration-300"
        data-id="${g.id}"
        data-title="${g.title}"
      >
        <section class="relative">
          <img
            src="${g.cover}"
            alt="The Witcher 3"
            class="w-full h-[420px] object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
          <span class="absolute top-4 left-4 bg-zinc-900/80 text-emerald-400 px-4 py-2 rounded-2xl text-2xl font-bold">${g.id}</span>
          <button class="add-collection-button absolute top-4 right-4 w-14 h-14 rounded-full bg-white/20 text-white text-3xl">+</button>
        </section>
        <section class="p-6">
          <h3 class="text-2xl font-bold text-white mb-2">${g.title}</h3>
          <p class="text-slate-400">${g.releaseDate}</p>
        </section>
      </article>`
    });
    gameCollection.innerHTML = '';

    gameCollection.innerHTML += result;

}

function noGames() {
    gameCollection.classList = "flex flex-col items-center justify-center py-32";
    gameCollection.innerHTML = `<p class="text-slate-500 text-lg mb-6">Geen games in dit categorie</p>
            <button class="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-8 rounded-2xl transition shadow-lg shadow-purple-500/20">
                Ontdek Games
            </button>`;
}

async function updateCollectionPage() {
    if (collectionIds.length > 0) {
        await showGames();
        updateGameCards();
    }
    else {
        noGames();
    }
}


const modal = document.querySelector("#gameModal");
const closeBtn = document.querySelector("#closeModal");

function updateGameCards() {
    const cards = document.querySelectorAll(".game-card");

    fetch("./data/details.json")
        .then(res => res.json())
        .then(games => {
            cards.forEach(card => {
                card.onclick = () => {
                    const game = games.find(g => g.id === Number(card.dataset.id));
                    if (!game) return;
                    // modal.dataset.id = game.id;
                    document.querySelector("#modalTitle").textContent = game.title;
                    document.querySelector("#modalDate").textContent = game.releaseDate;
                    document.querySelector("#modalDescription").textContent = game.description;
                    document.querySelector("#modalCover").src = game.cover;
                    document.querySelector("#gameModal").dataset.id= game.id;

                    document.querySelector("#modalCover").alt = game.title;
                    document.querySelector("#modalPlatforms").innerHTML = game.platforms
                        .map(p => `<span class="rounded-full bg-white/10 px-5 py-3 text-lg text-slate-200">${p}</span>`)
                        .join("");

                    modal.classList.remove("hidden");
                    modal.classList.add("flex");
                };
            });
        });
}

closeBtn.onclick = () => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
};

modal.onclick = e => {
    if (e.target === modal) {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
    }
};

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
    }
});

updateCollectionPage();

