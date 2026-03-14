const addToCollectionButtons = document.querySelectorAll(".add-collection-button");
const addToCollectionModalButton = document.querySelector(".add-collection-modal-button");
let collectionIds = getCollectionIdsFromLocalStorage();

function isIdInCollection(id) {
    return collectionIds.includes(id);
}

function removeIdFromCollection(id) {
    collectionIds = collectionIds.filter(colId => colId !== id);
}

function addIdToCollection(id) {
    collectionIds.push(id);
}

function setCollectionIdsToLocalStorage() {
    localStorage.setItem("collectionIds", JSON.stringify(collectionIds));
}

function getCollectionIdsFromLocalStorage() {
    return JSON.parse(localStorage.getItem("collectionIds") || "[]");
}

function addToCollectionHandler(id) {
    getCollectionIdsFromLocalStorage();
    if (isIdInCollection(id)) {
        removeIdFromCollection(id);
    }
    else {
        addIdToCollection(id);
    }
    setCollectionIdsToLocalStorage();
}

addToCollectionButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
        addToCollectionHandler(e.currentTarget.closest(".game-card").dataset.id);
        console.log(collectionIds);
    })
});

addToCollectionModalButton.addEventListener("click", (e) => {
    addToCollectionHandler(e.currentTarget.closest("#gameModal").dataset.id);
    console.log(collectionIds);
});


