import {dataHandler} from "../data/dataHandler.js";

function createLogModal(title) {
    const modalContainer = document.createElement("div");
    modalContainer.innerHTML = `
        <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
           <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">${title}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                    <label for="username">Username</label>
                    <input type="text" id="username" name="username" required>
                    <br><br>
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-success" id="save-new-user" data-bs-dismiss="modal">Save</button>
              </div>
            </div>
          </div>
        </div>
    `

    document.body.append(modalContainer);

    let modal = new bootstrap.Modal(modalContainer.querySelector(".modal"));
    modal.show();
}

function registerUserData(){
    createLogModal('Register');
    const saveBtn = document.querySelector('#save-new-user');
    saveBtn.addEventListener('click', () =>{
        const username = document.querySelector('#username').value;
        const password = document.querySelector('#password').value;
        const userData = [username, password]
        dataHandler.registerUser(userData);
        location.reload();
    });
}

async function register(){
    const registerBtn = document.querySelector('#register-btn');
    registerBtn.addEventListener('click', registerUserData);}

async function loginUserData(){
    createLogModal('Login');
    const saveBtn = document.querySelector('#save-new-user');
    saveBtn.addEventListener('click', async () => {
        const username = document.querySelector('#username').value;
        const password = document.querySelector('#password').value;
        const data = await dataHandler.loginUser(username, password);
        if (typeof data === "object") {
            alert(data[0])
            createLoggedInDiv(data[1]);
        }else{
            alert(data)
        }
    });
}

function createLoggedInDiv(username){
    const loggedInDiv = document.querySelector('.logged-in-msg');
    const logInMsg = document.createElement('p')
    logInMsg.classList.add('logged')
    logInMsg.innerHTML = `Logged in as ${username}`
    loggedInDiv.append(logInMsg)
}


async function login() {
    const loginBtn = document.querySelector('#login-btn');
    loginBtn.addEventListener('click', loginUserData);
}

async function logout(){
    const logoutBtn = document.querySelector('#logout-btn');
    logoutBtn.addEventListener('click', async () => {
        await dataHandler.logoutUser();
        location.reload();
    })
}

register();
login();
logout();