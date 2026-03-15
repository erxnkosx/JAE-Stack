let games = [];
let randomGame;
let blurImage;
const blurLevel = document.getElementById("blurLevel");
const skipGame = document.getElementById("skipGame");
const currentLevelEl = document.getElementById("currentLevel");
const currentProgressEl = document.getElementById("currentProgress");
let currentLevel = 1;
let currentProgress = 0;
let level = 40;

const loadGames = async () => {
    const response = await fetch("../data/details.json");
    const responseJson = await response.json();
    return responseJson.results;
};
// const inputGuess = document.getElementById("inputGuess");
const guessSubmit = document.getElementById("guessSubmit");

async function blurrGame() {
    if (games.length === 0) {
        games = await loadGames();
    }

    level = 40;
    randomGame = games[Math.floor(Math.random() * games.length)];
    blurImage = document.getElementById("blurImage");

    blurImage.style.filter = `blur(${level}px)`;
    blurLevel.textContent = `${level}%`;
    currentLevelEl.textContent = currentLevel;
    currentProgressEl.textContent = currentProgress;
    blurImage.src = randomGame.background_image;
}

(async function gameStart() {
    await blurrGame();
})();


const gameSearch = document.getElementById("gameSearch");
const suggestions = document.getElementById("suggestions");

function hide() {
    suggestions.classList.add("hidden");
    suggestions.innerHTML = "";
}

async function gameSearchHandler(input) {
    if (input.length > 1) {
        let results = games.filter(g => g.name.toLowerCase().startsWith(input.slice(0, 3).toLowerCase()));
        suggestions.classList.remove("hidden");
        suggestions.innerHTML = results.map(r => `<div class="suggestion hover:bg-white/10 text-white px-4 py-3 cursor-pointer ">${r.name}</div>`).join("");
        document.querySelectorAll(".suggestion").forEach(suggestion => {
            suggestion.addEventListener("click", (e) => {
                gameSearch.value = suggestion.innerHTML;
                hide();
            })
        });
    }
    else {
        hide();
    }
}

function gameWon() {
    currentProgress++;
    if (currentProgress === 10) {
        currentProgress = 0;
        currentLevel++;
    }

}

async function guessSubmitHandler() {
    if (!blurImage.classList.contains("duration-1000")) {
        blurImage.classList.add("duration-1000");
    }
    if (randomGame.name === gameSearch.value && level !== 0) {
        gameWon();
        await blurrGame();
    }
    else {
        if (level > 0) {
            level -= 10;
            blurLevel.innerHTML = `${level}%`;
            blurImage.style.filter = `blur(${level}px)`;
        }
    }
    gameSearch.value = '';
}

async function skipGameHandler() {
    blurImage.classList.remove("duration-1000");
    blurImage.style.filter = `blur(40px)`;
    await blurrGame();
}
gameSearch.addEventListener("input", (e) => (gameSearchHandler(e.currentTarget.value)));
guessSubmit.addEventListener("click", guessSubmitHandler);
skipGame.addEventListener("click", skipGameHandler);

