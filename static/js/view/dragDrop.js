import {dataHandler} from "../data/dataHandler.js";
import {cardsManager} from "../controller/cardsManager.js";

export function initDragAndDrop(card) {
        initElements(card);
        initDragEvents();
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

async function handleDrop(e) {
    e.preventDefault();
    const dropzone = e.currentTarget;
    const dragged = draggable.dragged;

    if (dropzone.dataset.boardId === dragged.dataset.boardId) {
        if (e.target.classList.contains("card") && e.target.dataset.cardId !== dragged.dataset.cardId && e.target.dataset.status === dragged.dataset.status) {
            const clone = e.target.cloneNode(true);
            const boardId = dragged.dataset.boardId;
            clone.dataset.order = dragged.dataset.order;
            dragged.dataset.order = e.target.dataset.order;
            const cardNumber = dropzone.children[1].children.length;

            await dataHandler.updateCard(dragged.dataset.cardId, {
                "status_id": dragged.dataset.status,
                "card_order": dragged.dataset.order - 1
            });
            await dataHandler.updateCard(clone.dataset.cardId, {
                "status_id": clone.dataset.status,
                "card_order": clone.dataset.order - 1
            });
            const cards = document.querySelectorAll(`.card-board-${boardId}`);
            cards.forEach((card) => card.remove());
            await cardsManager.loadCards(boardId);
        } else {
            dropzone.children[1].insertAdjacentElement("beforeend", dragged);
            const cardId = e.dataTransfer.getData("text/plain");
            const status = dropzone.dataset.status;
            const boardId = dragged.dataset.boardId;
            dragged.dataset.status = status;
            const cardsCount = await dataHandler.getCardNumber(boardId, status);
            dragged.dataset.order = cardsCount[0]["count"] + 1;
            await dataHandler.updateCard(cardId, {"status_id": status, "card_order": cardsCount[0]["count"]});
            }
        }
}




