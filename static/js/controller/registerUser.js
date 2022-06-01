import {dataHandler} from "../data/dataHandler.js";

function createRegisterModal() {
    const modalContainer = document.createElement("div");
    modalContainer.innerHTML = `
        <div class="modal" tabindex="-1" id="new-board-modal">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Register</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                    <label for="username">Username</label>
                    <input type="text" id="username" name="username" required>
                    <br>
                    <br>
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-primary" id="save-new-user" data-bs-dismiss="modal">Save</button>
              </div>
            </div>
          </div>
        </div>
    `

    document.body.append(modalContainer);

    let modal = new bootstrap.Modal(modalContainer.querySelector(".modal"));
    modal.show();
}

function getUserData(){
    createRegisterModal();
    const saveBtn = document.querySelector('#save-new-user');
    saveBtn.addEventListener('click', () =>{
        const username = document.querySelector('#username').value;
        const password = document.querySelector('#password').value;
        const userData = [username, password]
        dataHandler.registerUser(userData);
    });
}

async function register(){
    const registerBtn = document.querySelector('#register-btn');
    registerBtn.addEventListener('click', getUserData);
}

register();
