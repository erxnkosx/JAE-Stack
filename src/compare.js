"use strict";

let allGames = [];

async function init() {
    try {
       
        const response = await fetch("src/games.json");
        const data = await response.json();
        allGames = data.results;

        updateGame(0, 1); 
        updateGame(1, 2); 

        setupButtons();

    } catch (error) {
        console.error("Fout bij laden JSON:", error);
    }
}

function updateGame(gameIndex, side) {
    const game = allGames[gameIndex];
    if (!game) {return;}

    document.getElementById(`game-img-${side}`).src = game.background_image;
    document.getElementById(`game-name-${side}`).innerText = game.name;
    document.getElementById(`game-meta-${side}`).innerText = 
        `Beoordeling: ${game.rating} • Metacritic: ${game.metacritic || 'N/A'}`;

    document.getElementById(`rating-${side}`).innerText = game.rating;
    document.getElementById(`releasedate-${side}`).innerText = game.released;
    const countPlatform = game.platforms.length;
    document.getElementById(`platform-${side}`).innerText = countPlatform;

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
}

function compareRow(id) {
    const el1 = document.getElementById(`${id}-1`);
    const el2 = document.getElementById(`${id}-2`);
    
    const parent = el1.closest('li');
    const arrowLeft = parent.querySelector('.arrow-left');
    const arrowRight = parent.querySelector('.arrow-right');

    const val1 = parseFloat(el1.innerText);
    const val2 = parseFloat(el2.innerText);

    el1.className = "text-xl font-mono text-gray-400";
    el2.className = "text-xl font-mono text-gray-400";
    
    if (arrowLeft) {
        arrowLeft.innerText = "—";
        arrowLeft.className = "arrow-left text-gray-500";
    }
    if (arrowRight) {
        arrowRight.innerText = "—";
        arrowRight.className = "arrow-right text-gray-500";
    }
    if (val1 > val2) {
        el1.classList.replace('text-gray-400', 'text-green-400');
        el2.classList.replace('text-gray-400', 'text-red-400');
        if (arrowLeft) { arrowLeft.innerText = "↗"; arrowLeft.classList.replace('text-gray-500', 'text-green-500'); }
        if (arrowRight) { arrowRight.innerText = "↘"; arrowRight.classList.replace('text-gray-500', 'text-red-500'); }
    } else if (val1 < val2) {
        el1.classList.replace('text-gray-400', 'text-red-400');
        el2.classList.replace('text-gray-400', 'text-green-400');
        if (arrowLeft) { arrowLeft.innerText = "↘"; arrowLeft.classList.replace('text-gray-500', 'text-red-500'); }
        if (arrowRight) { arrowRight.innerText = "↗"; arrowRight.classList.replace('text-gray-500', 'text-green-500'); }
    }
}
init();