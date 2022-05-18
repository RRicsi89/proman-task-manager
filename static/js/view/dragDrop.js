import {dataHandler} from "../data/dataHandler.js";

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

async function handleDrop(e) {
    e.preventDefault();
    const dropzone = e.currentTarget;
    const dragged = draggable.dragged;

    if (dropzone.dataset.boardId === dragged.dataset.boardId) {
        if (e.target.classList.contains("card")) {
            const clone = e.target;
            let cardsRemaining = new Array();
            if (e.target.dataset.cardId !== dragged.dataset.cardId) {
                e.target.replaceWith(dragged);
                const cardNumber = dropzone.children[1].children.length;
                for (let i = 0; i < cardNumber; i++) {
                    if (dropzone.children[1].children[i].dataset.cardId === dragged.dataset.cardId) {
                        cardsRemaining.push(dragged);
                        cardsRemaining.push(clone);
                    } else {
                        cardsRemaining.push(dropzone.children[1].children[i]);
                    }
                }
                for (let j = 0; j <= cardNumber; j++) {
                    if (j === cardNumber) {
                        dropzone.children[1].appendChild(cardsRemaining[j]);
                    } else {
                        dropzone.children[1].children[j].replaceWith(cardsRemaining[j]);
                    }
                }
            }
        } else {
            dropzone.children[1].insertAdjacentElement("beforeend", dragged);
        }
    };
    const cardId = e.dataTransfer.getData("text/plain");
    const status = dropzone.dataset.status;
    const boardId = dragged.dataset.boardId;
    dragged.dataset.status = status;
    const cardsCount = await dataHandler.getCardNumber(boardId, status);
    await dataHandler.updateCard(cardId, {"status_id": status, "card_order": cardsCount[0]["count"]});
}