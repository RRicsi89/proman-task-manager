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
    addBoardColumns(boardId, statuses) {
        const parent = document.querySelector(`#bc-${boardId}`);
        const content = document.createElement("div");
        content.classList.add(`board-columns-${boardId}`);
        content.style.display = "none";
        for (let status of statuses) {
            const column = document.createElement("div");
            column.classList.add("board-column", `dropzone-${boardId}`);
            column.dataset.boardId = boardId;
            column.dataset.status = status["status_id"];

            const  columnTitle = document.createElement("div");
            columnTitle.classList.add(`board-column-title-${boardId}`);
            columnTitle.dataset.status = status["status_id"];
            columnTitle.textContent = `${status["title"]}`;

            const columnContent = document.createElement("div");
            columnContent.classList.add(`bcc-${boardId}`, `board-column-content`, `${status["status_id"]}-${boardId}`);
            columnContent.setAttribute("id", `${status["status_id"]}-${boardId}`);
            columnContent.dataset.id = `${status["status_id"]}-${boardId}`;

            column.append(columnTitle, columnContent);
            content.appendChild(column);
        }
        if (parent) {
            parent.appendChild(content);
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
    renameColumns(boardId){
        let columnTitles = document.querySelectorAll(`.board-column-title-${boardId}`);
        columnTitles.forEach(title => {
            title.addEventListener('dblclick', function (e){
                const status = title.dataset.status;
                let statusTitle = e.currentTarget.textContent;
                let input = document.createElement('input');
                input.value = statusTitle;
                input.type = 'input';
                input.addEventListener('keypress', function (e) {
                    if (e.key === 'Enter') {
                        let statusTitle = input.value;
                        title.innerHTML = statusTitle;
                        // dataHandler.updateColumnTitle(boardId, status, statusTitle)
                        //     .then(result => (result[0].id))
                        //     .then(statusId => console.log(statusId))
                        dataHandler.renameColumn(status, statusTitle);
                    }
                });
                title.innerHTML = "";
                title.appendChild(input);
                input.focus();
            })
        })

    },
    async addNewCard(boardId) {
        const cardTitle = "New card";
        await dataHandler.createNewCard(cardTitle, boardId);
        const cards = await dataHandler.getNewCard(boardId);
        const card = cards[0];
        const cardBuilder = await htmlFactory(htmlTemplates.card);
        const content = cardBuilder(card);
        this.addChild(`.board-column-content[data-id="1-${boardId}"]`, content);
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
            newColumnButton.dataset.boardId = boardId;
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
                const boardId = button.dataset.boardId;
                let input = document.createElement('input');
                let saveButton = document.createElement('button');
                saveButton.textContent = "Save";
                input.type = 'text';

                saveButton.addEventListener('click',  function (e) {
                    let boardHeader = document.querySelector(`#bc-${boardId}>.board-header`);
                    const content = document.querySelector(`.board-columns-${boardId}`);
                    let columnNumber = boardHeader.nextElementSibling.children.length + 1;
                    let newColumnName = input.value;
                    const column = document.createElement("div");
                    column.classList.add("board-column", `dropzone-${boardId}`);
                    column.dataset.boardId = boardId;
                    column.dataset.status = columnNumber;

                    const  columnTitle = document.createElement("div");
                    columnTitle.classList.add(`board-column-title-${boardId}`);
                    columnTitle.dataset.status = columnNumber;
                    columnTitle.textContent = newColumnName;

                    const columnContent = document.createElement("div");
                    columnContent.classList.add(`bcc-${boardId}`, `board-column-content`, `${columnNumber}-${boardId}`);
                    columnContent.setAttribute("id", `${columnNumber}-${boardId}`);
                    columnContent.dataset.id = `${columnNumber}-${boardId}`;

                    column.append(columnTitle, columnContent);
                    // content.appendChild(column);

                    if (content) {
                        content.appendChild(column);
                    } else {
                        console.error("could not find such html element");
                    }
                    e.preventDefault();

                    let newColumnButton = document.querySelector(`#bc-${boardId}>.board-header>.new-column-button`);
                    boardHeader.removeChild(newColumnButton);
                    let newColumnButton1 = document.createElement('button');
                    newColumnButton1.textContent = 'Add new column';
                    newColumnButton1.classList.add('new-column-button');
                    boardHeader.insertBefore(newColumnButton1, boardHeader.children[2]);
                    domManager.addNewColumn();

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