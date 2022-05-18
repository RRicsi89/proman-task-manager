export const htmlTemplates = {
    board: 1,
    card: 2
}

export const builderFunctions = {
    [htmlTemplates.board]: boardBuilder,
    [htmlTemplates.card]: cardBuilder
};

export function htmlFactory(template) {
    if (builderFunctions.hasOwnProperty(template)) {
        return builderFunctions[template];
    }

    console.error("Undefined template: " + template);

    return () => {
        return "";
    };
}

function boardBuilder(board) {
    return `<div class="board-container">
                <div class="toggle-board-button" data-board-id=${board.id}>
                    <section class="board">
                        <div class="board-header"><span class="board-title">${board.title}</span>
                            <button class="board-add">Add Card</button>
                            <button class="board-toggle toggle-btn-${board.id}" data-board-id="${board.id}"><i class="fas fa-chevron-down"></i></button>
                        </div>
                    </section>
                </div>
            </div>`;
}

function cardBuilder(card) {
    return `
        <div class="card-remove"><i class="fas fa-trash-alt"></i></div>
        <div class="card card-id-${card.id}" data-card-id="${card.id}">${card.title}</div>
    `;
}

