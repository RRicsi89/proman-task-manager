import {boardsManager} from "./controller/boardsManager.js";
import {addNewBoard} from "./controller/htmlManager.js";

function init() {
    boardsManager.loadBoards();
    addNewBoard();
}

init();
