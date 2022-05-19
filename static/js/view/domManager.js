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
        const card = await dataHandler.getNewCard(boardId);
        const cardBuilder = htmlFactory(htmlTemplates.card);
        const content = cardBuilder(card);
        this.addChild(`.new-card-${boardId}`, content);
        this.addEventListener(`.card-id-${card.id}`, 'click', deleteButtonHandler);
        initDragAndDrop(card);
    }
};
