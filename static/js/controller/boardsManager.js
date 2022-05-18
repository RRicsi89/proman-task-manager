import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {cardsManager} from "./cardsManager.js";

export let boardsManager = {
    loadBoards: async function () {
        const boards = await dataHandler.getBoards();
        for (let board of boards) {
            const boardBuilder = htmlFactory(htmlTemplates.board);
            const content = boardBuilder(board);
            await domManager.addChild("#root", content);
            domManager.addBoardColumns(board.id);
            cardsManager.loadCards(board.id);
            domManager.addEventListener(
                `.toggle-board-button[data-board-id="${board.id}"]`,
                "click",
                showHideButtonHandler
            );
        }
        domManager.renameBoard();
    },
};

export function showHideButtonHandler(clickEvent) {
    const boardId = clickEvent.target.parentElement.dataset.boardId;
    const boardBody = document.querySelector(`.board-columns-${boardId}`);
    if (boardBody.style.display === "none"){
        document.querySelector(`.toggle-btn-${boardId}`).firstElementChild.classList.remove("fas", "fa-chevron-down");
        document.querySelector(`.toggle-btn-${boardId}`).firstElementChild.classList.add("fas", "fa-chevron-up");
        boardBody.style.display = "flex";
    } else {
        document.querySelector(`.toggle-btn-${boardId}`).firstElementChild.classList.remove("fas", "fa-chevron-up");
        document.querySelector(`.toggle-btn-${boardId}`).firstElementChild.classList.add("fas", "fa-chevron-down");
        boardBody.style.display = "none";
    }
}
