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
    return `<div id="board-${board.id}" class="board-container">
                <div class="board board-id-${board.id}" data-board-id=${board.id}>
                    <section id="bc-${board.id}" class="board board-box-${board.id}">
                        <div class="board-header"><span class="board-title" data-id="${board.id}">${board.title}</span>
                            <button class="board-add">Add Card</button>
                            <button class="board-toggle toggle-btn-${board.id} toggle-board-button" data-board-id="${board.id}"><i class="fas fa-chevron-down"></i></button>
                        </div>
                    </section>
                </div>
            </div>`;
}

function cardBuilder(card) {
    return `
        <div class="card card-id-${card.id} card-board-${card["board_id"]}" 
                    data-card-id="${card.id}" 
                    data-board-id="${card['board_id']}" 
                    data-status="${card['status_id']}">${card.title}
            <div class="card-remove"><i class="fas fa-trash-alt"></i></div>
        </div>
        
    `;
}

