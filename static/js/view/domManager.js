import {dataHandler} from "../data/dataHandler.js";

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
        const content = `
            <div class="board-columns-${boardId}" style="display: none">
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
            </div>
        `
        if (parent) {
            parent.insertAdjacentHTML("beforeend", content);
        } else {
            console.error("could not find such html element: " + `#bc-${boardId}`);
        }
    },
    renameBoard(){
        let titles = document.querySelectorAll('.board-title');
        titles.forEach(title => {
            title.addEventListener('dblclick', function (e) {
                const boardId = e.target.dataset.id;
                let boardName = e.currentTarget.textContent;
                let input = document.createElement('input');
                let saveButton = document.createElement('button');
                saveButton.textContent = "Save";
                saveButton.dataset.id = boardId
                input.value = boardName;
                input.type = 'text';
                saveButton.addEventListener('click', function (e) {
                    let boardId = this.dataset.id;
                    let boardName = input.value;
                    title.innerHTML = boardName;
                    dataHandler.updateBoard(boardId, boardName)
                });
                title.innerHTML = "";
                title.appendChild(input);
                title.appendChild(saveButton);
                input.focus();
            })

        }
        )
    },
    toggleButton(boardId, style){
    const toggleButtons = document.querySelectorAll('.board-toggle');
    const newColumnButtonIndex = 2;
    for (let button of toggleButtons) {
        if (button.dataset.boardId === boardId){
            let newColumnButton = document.createElement('button');
            newColumnButton.textContent = 'Add new column';
            newColumnButton.classList.add('new-column-button');
            let currentHeader = button.parentNode;
            if (style === 'none'){
                currentHeader.insertBefore(newColumnButton, button);
            } else {
                currentHeader.children[newColumnButtonIndex].remove();
            }
        }
    }
    },
    addNewColumn(){
        const buttons = document.getElementsByClassName('new-column-button');
        for (let button of buttons){
            button.addEventListener('click', function (e){
                const parent = e.currentTarget.parentNode.parentNode.children[1];
                let boardId = e.currentTarget.parentNode.children[0].getAttribute('data-id');

                let input = document.createElement('input');
                let saveButton = document.createElement('button');
                saveButton.textContent = "Save";
                input.type = 'text';

                saveButton.addEventListener('click',  function (e) {
                    let newColumnName = input.value;
                    const content = `
                        <div class="board-column">
                            <div class="board-column-title">${newColumnName}</div>
                            <div class="bcc-${boardId} board-column-content input-card-${boardId}"></div>
                        </div>`;

                    if (parent) {
                        parent.insertAdjacentHTML("beforeend", content);
                    } else {
                        console.error("could not find such html element");
                    }
                    e.preventDefault();

                    // await dataHandler.addNewColumn(boardId);
                    let boardHeader = document.querySelector(`#bc-${boardId}>.board-header`);
                    let newColumnButton = document.querySelector(`#bc-${boardId}>.board-header>.new-column-button`);
                    boardHeader.removeChild(newColumnButton);
                    let newColumnButton1 = document.createElement('button');
                    newColumnButton1.textContent = 'Add new column';
                    newColumnButton1.classList.add('new-column-button');
                    boardHeader.insertBefore(newColumnButton1, boardHeader.children[2]);
                    domManager.addNewColumn();
                });
                button.innerHTML = "";
                button.appendChild(input);
                button.appendChild(saveButton);
                input.focus();
            })
        }
    },
    dynamicColumns(boardId, style){
        domManager.toggleButton(boardId, style);
        domManager.addNewColumn();
    },


    // renameColumns(){
    //     const board = document.querySelectorAll('#board-2');
    //     // console.log(board);
    //     let columnTitles = document.querySelectorAll('.board-column-title');
    //     columnTitles.forEach(title => {
    //         title.addEventListener('dblclick', function (e){
    //             const boardId = e.target.dataset.id;
    //             console.log(e.currentTarget.textContent);
    //         })
    //     })
    // }
};
