import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "./htmlFactory.js";
import {cardsManager, deleteButtonHandler} from "../controller/cardsManager.js";
import {initDragAndDrop} from "./dragDrop.js";

export let domManager = {
    addChild(parentIdentifier, childContent) {
        const parent = document.querySelector(parentIdentifier);
        if (parent) {
            parent.insertAdjacentHTML("beforeend", childContent);
        } else {
            console.error("could not find such html element: " + parentIdentifier);
        }
    },
    addEventListener(parentIdentifier, eventType, eventHandler) {
        const parent = document.querySelector(parentIdentifier);
        if (parent) {
            parent.addEventListener(eventType, eventHandler);
        } else {
            console.error("could not find such html element: " + parentIdentifier);
        }
    },
    addBoardColumns(boardId) {
        const parent = document.querySelector(`#bc-${boardId}`);
        const content = `
            <div class="board-columns-${boardId}" style="display: none">
                <div class="board-column dropzone-${boardId}" data-board-id="${boardId}" data-status="1">
                    <div class="board-column-title">New</div>
                    <div class="bcc-${boardId} board-column-content new-card-${boardId}"></div>
                </div>
                
                <div class="board-column dropzone-${boardId}" data-board-id="${boardId}" data-status="2">
                    <div class="board-column-title">In Progress</div>
                    <div class="bcc-${boardId} board-column-content in-progress-${boardId}"></div>
                </div>
                
                <div class="board-column dropzone-${boardId}" data-board-id="${boardId}" data-status="3">
                    <div class="board-column-title">Testing</div>
                    <div class="bcc-${boardId} board-column-content testing-${boardId}"></div>
                </div>
                
                <div class="board-column dropzone-${boardId}" data-board-id="${boardId}" data-status="4">
                    <div class="board-column-title">Done</div>
                    <div class="bcc-${boardId} board-column-content done-card-${boardId}"></div>
                </div>
            </div>
        `
        if (parent) {
            parent.insertAdjacentHTML("beforeend", content);
        } else {
            console.error("could not find such html element: " + `#bc-${boardId}`);
        }
    },
    renameBoard(){
        let titles = document.querySelectorAll('.board-title');
        titles.forEach(title => {
            title.addEventListener('dblclick', function (e) {
                const boardId = e.target.dataset.id;
                let boardName = e.currentTarget.textContent;
                let input = document.createElement('input');
                let saveButton = document.createElement('button');
                saveButton.textContent = "Save";
                saveButton.dataset.id = boardId
                input.value = boardName;
                input.type = 'text';
                saveButton.addEventListener('click', function (e) {
                    let boardId = this.dataset.id;
                    let boardName = input.value;
                    title.innerHTML = boardName;
                    dataHandler.updateBoard(boardId, boardName)
                });
                title.innerHTML = "";
                title.appendChild(input);
                title.appendChild(saveButton);
                input.focus();
            })
        }
        )
    },
    async addNewCard(boardId) {
        const cardTitle = "New card";
        await dataHandler.createNewCard(cardTitle, boardId);
        const cards = await dataHandler.getNewCard(boardId);
        const card = cards[0];
        const cardBuilder = await htmlFactory(htmlTemplates.card);
        const content = cardBuilder(card);
        this.addChild(`.new-card-${boardId}`, content);
        this.addEventListener(`.card-remove[data-card-id="${card.id}"]`, 'click', () => {
            deleteButtonHandler(card);
        });
        initDragAndDrop(card);
        renameCard();
    },
    toggleButton(boardId, style){
    const toggleButtons = document.querySelectorAll('.board-toggle');
    const newColumnButtonIndex = 2;
    for (let button of toggleButtons) {
        if (button.dataset.boardId === boardId){
            let newColumnButton = document.createElement('button');
            newColumnButton.textContent = 'Add new column';
            newColumnButton.classList.add('new-column-button');
            let currentHeader = button.parentNode;
            if (style === 'none'){
                currentHeader.insertBefore(newColumnButton, button);
            } else {
                currentHeader.children[newColumnButtonIndex].remove();
            }
        }
    }
    },
    addNewColumn(){
        const buttons = document.getElementsByClassName('new-column-button');
        for (let button of buttons){
            button.addEventListener('click', function (e){
                const parent = e.currentTarget.parentNode.parentNode.children[1];
                let boardId = e.currentTarget.parentNode.children[0].getAttribute('data-id');
                console.log(boardId);
                let input = document.createElement('input');
                let saveButton = document.createElement('button');
                saveButton.textContent = "Save";
                input.type = 'text';

                saveButton.addEventListener('click',  function (e) {
                    let newColumnName = input.value;
                    const content = `
                        <div class="board-column">
                            <div class="board-column-title">${newColumnName}</div>
                            <div class="bcc-${boardId} board-column-content input-card-${boardId}"></div>
                        </div>`;

                    if (parent) {
                        parent.insertAdjacentHTML("beforeend", content);
                    } else {
                        console.error("could not find such html element");
                    }
                    e.preventDefault();
                    let boardHeader = document.querySelector(`#bc-${boardId}>.board-header`);
                    let newColumnButton = document.querySelector(`#bc-${boardId}>.board-header>.new-column-button`);
                    boardHeader.removeChild(newColumnButton);
                    let newColumnButton1 = document.createElement('button');
                    newColumnButton1.textContent = 'Add new column';
                    newColumnButton1.classList.add('new-column-button');
                    boardHeader.insertBefore(newColumnButton1, boardHeader.children[2]);
                    domManager.addNewColumn();
                    let columnNumber = boardHeader.nextElementSibling.children.length;
                    dataHandler.addNewColumn(boardId, columnNumber, newColumnName)
                });
                button.innerHTML = "";
                button.appendChild(input);
                button.appendChild(saveButton);
                input.focus();
            })
        }
    },
    dynamicColumns(boardId, style){
        domManager.toggleButton(boardId, style);
        domManager.addNewColumn();
    },
};

export async function renameCard() {
    let cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('dblclick', function (e) {
            card.draggable = false;

            const cardId = card.dataset.cardId;
            let cardName = card.title;
            let input = document.createElement('input');
            const renamedCard = {
                "id": cardId,
                "board_id": card.dataset.boardId
            }
            let saveButton = document.createElement('button');
            saveButton.textContent = "Save";
            saveButton.dataset.id = cardId;
            input.value = cardName;
            input.type = 'text';
            let deleteBtn = document.createElement("div");
            deleteBtn.classList.add("card-remove");
            deleteBtn.dataset.cardId = cardId;
            deleteBtn.innerHTML = `<i class="fas fa-trash-alt"></i>`
            deleteBtn.addEventListener("click", () => {
                deleteButtonHandler(renamedCard);
            });

            saveButton.addEventListener('click', function (e) {
                card.draggable = true;
                cardName = input.value;
                card.textContent = cardName;
                dataHandler.renameCard(cardId, cardName);
                card.appendChild(deleteBtn);
            });
            card.innerHTML = "";
            card.appendChild(input);
            input.value = cardName;
            card.appendChild(saveButton);
            input.focus();
        })
    })
}