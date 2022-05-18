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
        const content = `<div class="board-columns">
                            <div class="board-column">
                                <div class="board-column-title">New</div>
                                <div class="bcc-${boardId} board-column-content new-card-${boardId}"></div>
                            </div>
                            <div class="board-column">
                                <div class="board-column-title">In Progress</div>
                                <div class="bcc-${boardId} board-column-content in-progress-${boardId}"></div>
                            </div>
                            <div class="board-column">
                                <div class="board-column-title">Testing</div>
                                <div class="bcc-${boardId} board-column-content testing-${boardId}"></div>
                            </div>
                            <div class="board-column">
                                <div class="board-column-title">Done</div>
                                <div class="bcc-${boardId} board-column-content done-card-${boardId}"></div>
                            </div>
                        </div>`
        if (parent) {
            parent.insertAdjacentHTML("beforeend", content);
        } else {
            console.error("could not find such html element: " + `#bc-${boardId}`);
        }
    }
};
