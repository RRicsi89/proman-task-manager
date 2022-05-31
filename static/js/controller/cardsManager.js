import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {initDragAndDrop} from "../view/dragDrop.js";
import {renameCard} from "../view/domManager.js";

export let cardsManager = {
    loadCards: async function (boardId, statuses) {
        const cards = await dataHandler.getCardsByBoardId(boardId);
        for (let card of cards) {
            const cardBuilder = htmlFactory(htmlTemplates.card);
            const content = cardBuilder(card);
            let parentIdentifier = new String();
            for (let status of statuses) {
                if (status["status_id"] === card["status_id"]){
                    parentIdentifier = `.board-column-content[data-id="${status["status_id"]}-${boardId}"]`;
                    domManager.addChild(parentIdentifier, content);
                }
                // domManager.addChild(parentIdentifier, content);
            }
            // switch (card["status_id"]) {
            //     case 1:
            //         parentIdentifier = `.new-card-${boardId}`;
            //         break
            //     case 2:
            //         parentIdentifier = `.in-progress-${boardId}`;
            //         break
            //     case 3:
            //         parentIdentifier = `.testing-${boardId}`;
            //         break
            //     case 4:
            //         parentIdentifier = `.done-card-${boardId}`;
            //         break
            // }
            domManager.addEventListener(
                `.card-remove[data-card-id="${card.id}"]`,
                "click",
                () => {
                    deleteButtonHandler(card, statuses);
                }
            );
            // initDragAndDrop(card);
        }
        renameCard();
    },
};

export async function deleteButtonHandler(card, statuses) {
    // const card = this;
    const cardId = card.id;
    const boardId = card["board_id"];
    await dataHandler.deleteCard(cardId);

    const cards = document.querySelectorAll(`.card-board-${boardId}`);
    cards.forEach((card) => card.remove());
    await cardsManager.loadCards(boardId, statuses);
}