const gameSearch = document.getElementById("gameSearch");
const box = document.getElementById("suggestions");

let t = null;

function hide() {
    if (!box) return;
    box.classList.add("hidden");
    box.innerHTML = '';
}

function show() {
    if (!box) return;
    box.classList.remove("hidden");
}

async function fetchGames(q) {
    if (!box) return;

    q = q.trim();
    if(q.length < 2) return hide();

    const response = await fetch(`/api/suggestions?q=${encodeURIComponent(q)}`);
    if(!response.ok) return hide();
    const results = await response.json();
    if(results.length === 0) return hide();


        box.innerHTML = results.map(r => `<div data-id="${r.id}" class="hover:bg-white/10 text-white px-4 py-3 cursor-pointer ">${r.name}</div>`).join("");
        show()
}

box?.addEventListener("click", (e) => {
    const item = e.target.closest("[data-id]");
    if (!item) return;
    window.location.href = `/ontdek/suggestions?id=${item.dataset.id}`;
});

document.addEventListener("click", (e) => {
    if (!box || !gameSearch) return;

    if (!box.contains(e.target) && !gameSearch.contains(e.target)) hide();
})

gameSearch?.addEventListener("input", () => {
    clearTimeout(t);
    t = setTimeout(() => fetchGames(gameSearch.value), 250);
});