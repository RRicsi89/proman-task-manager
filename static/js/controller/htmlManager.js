import {domManager} from "../view/domManager.js";
import {dataHandler} from "../data/dataHandler.js";

export let addNewBoard = function() {
    domManager.addEventListener(".button-container-center > button", "click", getBoardName);
}

function getBoardName() {
    const boardTitle = prompt("Title of the board");
    dataHandler.createNewBoard(boardTitle);
    return boardTitle
}

