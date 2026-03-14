const addToCollectionButtons = document.querySelectorAll(".add-collection-button");
const addToCollectionDetailButton = document.getElementById("collectionBtn");
const gameTitle = document.getElementById("gameTitle");
let collectionTitles = getCollectionTitlesFromLocalStorage();

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
    getCollectionTitlesFromLocalStorage();
    if (isTitleInCollection(title)) {
        removeTitleFromCollection(title);
    }
    else {
        addTitleToCollection(title);
    }
    setCollectionTitlesToLocalStorage();
}

addToCollectionButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
        addToCollectionHandler(e.currentTarget.closest(".game-card").dataset.id);
        console.log(collectionIds);
    });
});

addToCollectionDetailButton.addEventListener("click", (e) => {
    addToCollectionHandler(gameTitle.textContent);
    console.log(collectionTitles);

});


