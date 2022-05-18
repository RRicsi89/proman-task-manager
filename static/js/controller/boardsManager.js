import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {cardsManager} from "./cardsManager.js";
import {dragAndDrop} from "../view/dragDrop.js";

export let boardsManager = {
    loadBoards: async function () {
        const boards = await dataHandler.getBoards();
        for (let board of boards) {
            const boardBuilder = htmlFactory(htmlTemplates.board);
            const content = boardBuilder(board);
            await domManager.addChild("#root", content);
            domManager.addEventListener(
                `.toggle-board-button[data-board-id="${board.id}"]`,
                "click",
                showHideButtonHandler
            );
            dragAndDrop.initDragAndDrop(board.id);
        }
    },
};

function showHideButtonHandler(clickEvent) {
    const boardId = clickEvent.target.parentElement.dataset.boardId;
    const boardBody = document.querySelector(`#bc-${boardId}`);
    if (boardBody.children.length > 1){
        boardBody.children[1].remove();
        document.querySelector(`.toggle-btn-${boardId}`).firstElementChild.classList.remove("fas", "fa-chevron-up");
        document.querySelector(`.toggle-btn-${boardId}`).firstElementChild.classList.add("fas", "fa-chevron-down");
    } else {
        domManager.addBoardColumns(boardId);
        document.querySelector(`.toggle-btn-${boardId}`).firstElementChild.classList.remove("fas", "fa-chevron-down");
        document.querySelector(`.toggle-btn-${boardId}`).firstElementChild.classList.add("fas", "fa-chevron-up");
        cardsManager.loadCards(boardId);
    }
}
