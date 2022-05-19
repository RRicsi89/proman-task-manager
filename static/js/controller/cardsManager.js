import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {initDragAndDrop} from "../view/dragDrop.js";

export let cardsManager = {
    loadCards: async function (boardId) {
        const cards = await dataHandler.getCardsByBoardId(boardId);
        for (let card of cards) {
            const cardBuilder = htmlFactory(htmlTemplates.card);
            const content = cardBuilder(card);
            let parentIdentifier = new String();
            switch (card["status_id"]) {
                case 1:
                    parentIdentifier = `.new-card-${boardId}`;
                    break
                case 2:
                    parentIdentifier = `.in-progress-${boardId}`;
                    break
                case 3:
                    parentIdentifier = `.testing-${boardId}`;
                    break
                case 4:
                    parentIdentifier = `.done-card-${boardId}`;
                    break
            }
            domManager.addChild(parentIdentifier, content);
            domManager.addEventListener(
                `.card-id-${card.id}`,
                "click",
                deleteButtonHandler
            );
            initDragAndDrop(card);
        }
    },
};

async function deleteButtonHandler(clickEvent) {
    const card = this;
    const cardId = card.dataset.cardId;
    const boardId = card.dataset.boardId;
    await dataHandler.deleteCard(cardId);

    const cards = document.querySelectorAll(`.card-board-${boardId}`);
    cards.forEach((card) => card.remove());
    await this.loadCards(boardId);