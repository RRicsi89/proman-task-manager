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
            await cardsManager.loadCards(board.id);
            domManager.addEventListener(
                `.toggle-board-button[data-board-id="${board.id}"]`,
                "click",
                showHideButtonHandler
            );
            domManager.addEventListener(
                `.board-add[data-board-id="${board.id}"]`,
                "click",
                () => {
                    domManager.addNewCard(board.id);
                }
            );
        }
        domManager.renameBoard();
    },
};

export function showHideButtonHandler(clickEvent) {
    const boardId = clickEvent.target.parentElement.dataset.boardId;
    const boardBody = document.querySelector(`.board-columns-${boardId}`);
    if (boardBody.style.display === "none"){
        domManager.dynamicColumns(boardId, boardBody.style.display);
        document.querySelector(`.toggle-btn-${boardId}`).firstElementChild.classList.remove("fas", "fa-chevron-down");
        document.querySelector(`.toggle-btn-${boardId}`).firstElementChild.classList.add("fas", "fa-chevron-up");
        boardBody.style.display = "flex";
    } else {
        domManager.dynamicColumns(boardId, boardBody.style.display);
        document.querySelector(`.toggle-btn-${boardId}`).firstElementChild.classList.remove("fas", "fa-chevron-up");
        document.querySelector(`.toggle-btn-${boardId}`).firstElementChild.classList.add("fas", "fa-chevron-down");
        boardBody.style.display = "none";
    }
}
