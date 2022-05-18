export function initDragAndDrop(card) {
        initElements(card);
        initDragEvents();
    }


const dom = {
    hasClass: function(elem, cls) {
        return elem.classList.contains(cls);
    }
}

const draggable = {
    card: null,
    dragged: null
}
let items = {
    columns: null
};

function initElements(card) {
    items.card = document.querySelector(`.card-id-${card.id}`);
    items.columns = document.querySelectorAll(`.dropzone-${card["board_id"]}`);
    items.card.draggable = true;
}

function initDragEvents() {
    initDraggable(items.card);
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
    // console.log("Drag enter of ", e.currentTarget);
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDragLeave(e) {
    // console.log("Drag leave of ", e.currentTarget);
}

function handleDrop(e) {
    e.preventDefault();
    const dropzone = e.currentTarget;
    const dragged = draggable.dragged;
    console.log(dropzone);
    console.log(dragged);
    dropzone.children[1].insertAdjacentElement("beforeend", dragged);
    // if (dom.hasClass(dropzone, `.board-column`)) {
    //     dropzone.children[1].insertAdjacentElement("beforeend", dragged);
    // }
}