document.addEventListener("DOMContentLoaded", () => {
    let currentRawgId = null;

    const detail = document.querySelector("#gameDetails");
    const cards = document.querySelectorAll(".game-card");

    console.log("Aantal cards:", cards.length);

    const statusLabels = {
        backlog: "Nog te spelen",
        playing: "Aan het spelen",
        finished: "Uitgespeeld"
    };

    const statusColors = {
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

    function openModal() {
        detail?.classList.remove("hidden");
        detail?.classList.add("flex");
    }

    function closeModal() {
        detail?.classList.add("hidden");
        detail?.classList.remove("flex");
    }

    function setLoadingState() {
        document.querySelector("#gameTitle").textContent = "Laden...";
        document.querySelector("#gameDescription").textContent = "Details ophalen...";
        document.querySelector("#gameRating").textContent = "";
        document.querySelector("#gameDate").textContent = "";

        const platforms = document.querySelector("#gamePlatforms");

        if (platforms) {
            platforms.innerHTML = "";
        }
    }

    function fillGameDetails(game) {
        document.querySelector("#gameTitle").textContent = game.name;
        document.querySelector("#gameDescription").textContent = game.description_raw || "Geen beschrijving.";
        document.querySelector("#gameRating").textContent = game.rating || "N/A";
        document.querySelector("#gameDate").textContent = game.released || "Onbekend";

        const cover = document.querySelector("#gameCover");
        cover.src = game.background_image || "/images/placeholder.jpg";
        cover.alt = game.name;

        const platforms = document.querySelector("#gamePlatforms");

        if (!platforms) {
            return;
        }

        if (!game.platforms) {
            platforms.innerHTML = "";
            return;
        }

        platforms.innerHTML = game.platforms
            .map(platformInfo => `
                <span class="rounded-full bg-white/10 px-5 py-3 text-lg text-slate-200">
                    ${platformInfo.platform.name}
                </span>
            `)
            .join("");
    }

    async function openGameDetails(rawgId) {
        currentRawgId = Number(rawgId);

        setLoadingState();
        openModal();

        try {
            const response = await fetch(`/ontdek/game/${currentRawgId}`);

            if (!response.ok) {
                throw new Error("Game details konden niet geladen worden.");
            }

            const game = await response.json();

            fillGameDetails(game);
            await updateCollectionUI();
        } catch (error) {
            console.error(error);
            document.querySelector("#gameDescription").textContent = "Kon de details niet laden.";
        }
    }

    async function updateCollectionUI() {
        const collection = await fetchCollection();
        const game = collection.find(game => Number(game.rawg_id) === Number(currentRawgId));

        const collectionBtn = document.querySelector("#collectionBtn");
        const collectionStatus = document.querySelector("#collectionStatus");

        if (!collectionBtn || !collectionStatus) {
            return;
        }

        if (!game) {
            collectionStatus.textContent = "Niet in collectie";
            collectionStatus.className = "rounded-full px-4 py-2 text-sm font-semibold bg-red-600 text-white";

            collectionBtn.textContent = "Voeg toe aan collectie";
            collectionBtn.className = "w-fit min-w-[320px] rounded-xl px-8 py-4 text-xl font-semibold text-white transition bg-green-600 hover:bg-green-700";

            return;
        }

        collectionStatus.textContent = statusLabels[game.status] || "In collectie";
        collectionStatus.className = `rounded-full px-4 py-2 text-sm font-semibold ${statusColors[game.status] || "bg-slate-600"} text-white`;

        collectionBtn.textContent = "Verwijder uit collectie";
        collectionBtn.className = "w-fit min-w-[320px] rounded-xl px-8 py-4 text-xl font-semibold text-white transition bg-red-600 hover:bg-red-700";
    }

    function getCurrentGamePayload() {
        return {
            rawg_id: currentRawgId,
            title: document.querySelector("#gameTitle").textContent,
            nickname: prompt("Geef een bijnaam voor deze game (optioneel):") || "",
            status: "backlog",
            background_image: document.querySelector("#gameCover").src,
            rating: document.querySelector("#gameRating").textContent,
            released: document.querySelector("#gameDate").textContent,
            description: document.querySelector("#gameDescription").textContent
        };
    }

    async function addGameToCollection() {
        await fetch("/collection/api", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(getCurrentGamePayload())
        });
    }

    async function removeGameFromCollection() {
        const confirmed = confirm("Weet je zeker dat je deze game wilt verwijderen uit je collectie?");

        if (!confirmed) {
            return false;
        }

        await fetch(`/collection/api/${currentRawgId}`, {
            method: "DELETE"
        });

        return true;
    }

    async function toggleCollection() {
        if (!currentRawgId) {
            return;
        }

        const collection = await fetchCollection();
        const inCollection = collection.some(game => Number(game.rawg_id) === Number(currentRawgId));

        if (inCollection) {
            const removed = await removeGameFromCollection();

            if (!removed) {
                return;
            }
        } else {
            await addGameToCollection();
        }

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

        await updateCollectionUI();
    }


    function setupCardEvents() {
        cards.forEach(card => {
            card.addEventListener("click", () => {
                openGameDetails(card.dataset.id);
            });
        });
    }

    function setupModalEvents() {
        document.querySelector("#closeGameDetails")?.addEventListener("click", closeModal);

        detail?.addEventListener("click", event => {
            if (event.target === detail) {
                closeModal();
            }
        });
    }

    function setupCollectionEvents() {
        document.querySelector("#collectionBtn")?.addEventListener("click", toggleCollection);

        document.querySelector("#setBacklog")?.addEventListener("click", () => changeStatus("backlog"));
        document.querySelector("#setPlaying")?.addEventListener("click", () => changeStatus("playing"));
        document.querySelector("#setFinished")?.addEventListener("click", () => changeStatus("finished"));
    }


    function init() {
        setupCardEvents();
        setupModalEvents();
        setupCollectionEvents();
    }

    init();
});