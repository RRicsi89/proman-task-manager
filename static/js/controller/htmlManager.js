import {domManager} from "../view/domManager.js";
import {dataHandler} from "../data/dataHandler.js";

export let addNewBoard = function() {
    domManager.addEventListener(".button-container-center > button", "click", getBoardName);
}

async function getBoardName() {
    createModal();
    const boardTitleField = document.querySelector("#board-name");
    let boardTitle = new String();
    boardTitleField.addEventListener("change", function() {
        boardTitle = boardTitleField.value;
    })
    domManager.addEventListener("#save-table-name", "click", async () => {
        await dataHandler.createNewBoard(boardTitle);
        const boards = await dataHandler.getBoards();
        const lastBoard = boards[boards.length - 1];
        const boardBuilder = htmlFactory(htmlTemplates.board);
        const content = boardBuilder(lastBoard);
        await domManager.addChild("#root", content);
        domManager.addBoardColumns(lastBoard.id);
        cardsManager.loadCards(lastBoard.id);
        domManager.addEventListener(
            `.toggle-board-button[data-board-id="${lastBoard.id}"]`,
            "click",
            showHideButtonHandler
        );
    });

    return boardTitle
}


function createModal() {
    const modalContainer = document.createElement("div");
    modalContainer.innerHTML = `
        <div class="modal" tabindex="-1" id="new-board-modal">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Create new board</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                    <label for="board-name">Board name</label>
                    <input type="text" id="board-name" name="board-name" required>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-primary" id="save-table-name" data-bs-dismiss="modal">Save</button>
              </div>
            </div>
          </div>
        </div>
    `

    document.body.append(modalContainer);

    var modal = new bootstrap.Modal(modalContainer.querySelector(".modal"));
    modal.show();
}

