let allGames = [];

async function init() {
    const response = await fetch("/compare/api");
    allGames = await response.json();

    const index1 = Math.floor(Math.random() * allGames.length);
    let index2 = Math.floor(Math.random() * allGames.length);
    while (index2 === index1) index2 = Math.floor(Math.random() * allGames.length);

    updateGame(index1, 1);
    updateGame(index2, 2);

    setupButtons();
}

function updateGame(gameIndex, side) {
    const game = allGames[gameIndex];

    document.getElementById(`game-img-${side}`).src = game.background_image;
    document.getElementById(`game-name-${side}`).innerText = game.name;
    document.getElementById(`game-meta-${side}`).innerText = 
        `Beoordeling: ${game.rating} • Metacritic: ${game.metacritic || 'N/A'}`;

    document.getElementById(`rating-${side}`).innerText = game.rating;
    document.getElementById(`meta-rating-${side}`).innerText = game.metacritic || 'N/A';
    document.getElementById(`releasedate-${side}`).innerText = game.released || 'Onbekend';
    document.getElementById(`platform-${side}`).innerText = game.platforms?.length || 0;

    compareStats();
}

function setupButtons() {
    document.getElementById('button-change-1').onclick = () => {
        const randomIndex = Math.floor(Math.random() * allGames.length);
        updateGame(randomIndex, 1);
    };

    document.getElementById('button-change-2').onclick = () => {
        const randomIndex = Math.floor(Math.random() * allGames.length);
        updateGame(randomIndex, 2);
    };
}

function compareStats() {
    compareRow('rating');
    compareRow('platform');
    compareRow('meta-rating');
    compareRow('releasedate', "date");
}

function getComparableValue(element, type="") {
    const text = element.innerText.trim();

    if (type === "date") {
        return new Date(text).getTime();
    }

    return parseFloat(text);
}

function compareRow(id, type="") {
    const el1 = document.getElementById(`${id}-1`);
    const el2 = document.getElementById(`${id}-2`);
    
    const parent = el1.closest('li');
    const arrowLeft = parent.querySelector('.arrow-left');
    const arrowRight = parent.querySelector('.arrow-right');

    const val1 = getComparableValue(el1, type);
    const val2 = getComparableValue(el2, type);

    el1.className = "text-xl font-mono text-slate-400 text-left";
    el2.className = "text-xl font-mono text-slate-400 text-right";
    
    if (arrowLeft) {
        arrowLeft.innerText = "—";
        arrowLeft.className = "arrow-left text-slate-500";
    }
    if (arrowRight) {
        arrowRight.innerText = "—";
        arrowRight.className = "arrow-right text-slate-500";
    }
    if (val1 > val2) {
        el1.classList.replace('text-slate-400', 'text-green-400');
        el2.classList.replace('text-slate-400', 'text-red-400');
        if (arrowLeft) {
            arrowLeft.innerText = "↗";
            arrowLeft.classList.replace('text-slate-500', 'text-green-500');
        }
        if (arrowRight) {
            arrowRight.innerText = "↘";
            arrowRight.classList.replace('text-slate-500', 'text-red-500');
        }
    } else if (val1 < val2) {
        el1.classList.replace('text-slate-400', 'text-red-400');
        el2.classList.replace('text-slate-400', 'text-green-400');
        if (arrowLeft) {
            arrowLeft.innerText = "↘";
            arrowLeft.classList.replace('text-slate-500', 'text-red-500');
        }
        if (arrowRight) {
            arrowRight.innerText = "↗";
            arrowRight.classList.replace('text-slate-500', 'text-green-500');
        }
    }
}
init();