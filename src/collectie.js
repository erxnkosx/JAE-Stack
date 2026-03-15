const addToCollectionDetailButton = document.getElementById("collectionBtn");
const gameTitle = document.getElementById("gameTitle");
let collectionTitles = getCollectionTitlesFromLocalStorage();

let games = [];

const loadGames = async () => {
    const response = await fetch("../data/details.json");
    const responseJson = await response.json();
    let results = responseJson.results;
    const ids = results.map(res => res.id);

    const descriptions = await Promise.all(ids.map(async id => {
        const response2 = await fetch(`https://api.rawg.io/api/games/${id}?key=b98606b4c7c748e991abd01ef0674fdc`);
        const response2Json = await response2.json();
        const description = `${response2Json.description_raw.split(".")[0]}.`;
        return description;
    }));

    results = results.map((res, idx) => ({
        ...res,
        description: descriptions[idx]
    }));
    return results;
};

(async () => games = await loadGames())();

function isTitleInCollection(title) {
    return collectionTitles.includes(title);
}

function removeTitleFromCollection(title) {
    collectionTitles = collectionTitles.filter(colTitle => colTitle !== title);
}

function addTitleToCollection(title) {
    collectionTitles.push(title);
}

function setCollectionTitlesToLocalStorage() {
    localStorage.setItem("collectionTitles", JSON.stringify(collectionTitles));
}

function getCollectionTitlesFromLocalStorage() {
    return JSON.parse(localStorage.getItem("collectionTitles") || "[]");
}

function addToCollectionHandler(title) {
    collectionTitles =  getCollectionTitlesFromLocalStorage();
    if (isTitleInCollection(title)) {
        removeTitleFromCollection(title);
    }
    else {
        addTitleToCollection(title);
    }
    setCollectionTitlesToLocalStorage();
}



function sortGames(games, sortBy) {
    const sortedGames = [...games];

    if (sortBy === "released") {
        sortedGames.sort((a, b) => new Date(b.released) - new Date(a.released));
    } else if (sortBy === "rating") {
        sortedGames.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "name") {
        sortedGames.sort((a, b) => a.name.localeCompare(b.name));
    }

    return sortedGames;
}



addToCollectionDetailButton.addEventListener("click", (e) => {
    addToCollectionHandler(gameTitle.textContent);
    console.log(collectionTitles);

});

console.log(games);

