export let dataHandler = {
    getBoards: async function () {
        return await apiGet("/api/boards");
    },
    getBoard: async function (boardId) {
        return await apiGet(`/api/boards/${boardId}`);
    },
    getStatuses: async function () {
        return await apiGet("/api/statuses");
    },
    getStatus: async function (statusId) {
        return await apiGet(`/api/statuses/${statusId}`);
    },
    getCardsByBoardId: async function (boardId) {
        return await apiGet(`/api/boards/${boardId}/cards/`);
    },
    getCard: async function (cardId) {
        return await apiGet(`/api/cards/${cardId}`);
    },
    createNewBoard: async function (boardTitle) {
        return await apiPost(`/api/boards`, boardTitle);
    },
    createNewCard: async function (cardTitle, boardId) {
        return await apiPost(`/api/boards/${boardId}/`, cardTitle);
    },
    deleteCard: async function (cardId) {
        return await apiDelete(`/api/cards/${cardId}`);
    },
    deleteBoard: async function (boardId) {
        return await apiDelete(`/api/boards/${boardId}`);
    },
    updateCard: async function (cardId, cardData) {
        return await apiPut(`/api/cards/${cardId}`, cardData)
    },
    updateBoard: async function (boardId, boardData) {
        return await apiPut(`/api/boards/${boardId}`, boardData)
    },
    getCardNumber: async function(board_id, status_id) {
        return await apiGet(`/api/boards/${board_id}/statuses/${status_id}/`)
    },
    getNewCard: async function(board_id) {
        return await apiGet(`/api/board/${board_id}`)
    },
    addNewColumn: async function (boardId, statusId, columnName) {
        return await apiPut(`/api/boards/${boardId}/${statusId}/new_column`, columnName)
    },
    renameCard: async function (cardId, cardData) {
        return await apiPut(`/api/card/${cardId}`, cardData)
    },
};


async function apiGet(url) {
    let response = await fetch(url, {
        method: "GET",
    });
    if (response.ok) {
        return await response.json();
    }
}

async function apiPost(url, payload) {
    let response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {'Content-Type': 'application/json'}
    });
    if (response.ok) {
        return await response.json();
    }
}

async function apiDelete(url) {
    let response = await fetch(url, {
        method: "DELETE",
    });
    if (response.ok) {
        return await response.json();
    }
}

async function apiPut(url, payload) {
    let response = await fetch(url, {
        method: "PUT",
        body: JSON.stringify(payload),
        headers: {'Content-Type': 'application/json'}
    });
    if (response.ok) {
        return await response.json();
    }
}

async function apiPatch(url) {
    let response = await fetch(url, {
        method: "PATCH",

    });
    if (response.ok) {
        return await response.json();
    }
}
