export let dragAndDrop = {
    initDragAndDrop(boardId) {
        initElements(boardId);
        initDragEvents(boardId);
    }
}

const dom = {
    hasClass: function(elem, cls) {
        return elem.classList.contains(cls);
    }
}

const draggable = {
    dragged: null
}
let items = {
    cards: null,
    columns: null
};

function initElements(boardId) {
    items.cards = document.querySelectorAll(`.card-board-${boardId}`);
    items.columns = document.querySelectorAll(`.bcc-${boardId}`);
    items.cards.forEach(function (card) {
        card.draggable = true;
    })
}

function initDragEvents() {
    items.cards.forEach(function (card) {
        initDraggable(card);
    });
    items.columns.forEach(function (column) {
        initDropzone(column);
    })
}

function initDraggable(draggable) {
    draggable.setAttribute("draggable", true);
    draggable.addEventListener("dragstart", handleDragStart);
    draggable.addEventListener("dragend", handleDragEnd);
}

function initDropzone(dropzone) {
    dropzone.addEventListener("dragenter", handleDragEnter);
    dropzone.addEventListener("dragover", handleDragOver);
    dropzone.addEventListener("dragleave", handleDragLeave);
    dropzone.addEventListener("drop", handleDrop);
}

function handleDragStart(e) {
    draggable.dragged = e.currentTarget;
    e.currentTarget.classList.add("dragged");
    e.dataTransfer.setData("text/plain", e.target.dataset.cardId);
}

function handleDragEnd(e) {
    e.currentTarget.classList.remove("dragged");
    draggable.dragged = null;
}

function handleDragEnter(e) {
    console.log("Drag enter of ", e.currentTarget);
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDragLeave(e) {
    console.log("Drag leave of ", e.currentTarget);
}

function handleDrop(e, boardId) {
    e.preventDefault();
    const dropzone = e.currentTarget;
    const dragged = draggable.dragged;
    if (dom.hasClass(dropzone, `.bcc-${boardId}`)) {
        dropzone.insertAdjacentElement("beforeend", dragged);
    }
}