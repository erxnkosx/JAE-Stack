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
init();