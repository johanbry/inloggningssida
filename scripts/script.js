
/* function findUser(username): Returns user object with specified username from user list. */
function findUser(username){
    const users = getUsers();
    return users.find(element => element.username === username);
}

/* function findUserIndex(username): Returns index in user list for specified username. */
function findUserIndex(username){
    const users = getUsers();
    return users.findIndex(element => element.username === username);
}

/* function userExists(username): Checks if user exists in user list. Returns true or false. */
function userExists(username){
    const users = getUsers();
    return ((users.findIndex(element => element.username === username)) > -1);
}

/* function addUser(username, password): Adds user to user list if user not already exists. Returns true if success or false if already exists. */
function addUser(username, password){
    if(!userExists(username)){
        let users = getUsers();
        users.push({username: username, password: password});
        saveUsers(users);
        return true;
    } else return false;
}

/* function deleteUser(username): Removes user object with specified user name from user list array. */
function deleteUser(username){
    let users = getUsers();
    users.splice(findUserIndex(username), 1);
    saveUsers(users);
}

/* function checkPassword(username, password): Check password for user. Returns true if success, else false, or -1 if user not exists. */
function checkPassword(username, password){
    const obj = findUser(username);
    if(obj)
        return (obj.password === password);
    else return -1;
}

/* function logoutUser(username): Logout currently logged in user. */
function logoutUser(username){
    setLoggedInUser(-1);
}

/* function loginUser(username): Login user with specified username. */
function loginUser(username){
    setLoggedInUser(username);
}

/* function getLoggedInUser(): Returns loggedInUser user name from Local Storage. */
function getLoggedInUser(){
    return localStorage.getItem("loggedInUser");
}

/* function setLoggedInUser(username): Sets loggedInUser in Local Storage with specified user name. */
function setLoggedInUser(username){
    localStorage.setItem("loggedInUser", username);
}

/* function getUsers(): Returns user list from Local Storage as an array with objects. */
function getUsers(){
    return JSON.parse(localStorage.getItem("users"));
}

/* function saveUsers(): Saves the user list in Local Storage. */
function saveUsers(users){
    localStorage.setItem("users", JSON.stringify(users));    
}

/* function renderHTMLHeader(view): Renders dynamic content in header depending on state, logged in or not. */
function renderHTMLHeader(view){
    const div = document.getElementById("topRightHeader");
    switch(view){
        case "notLoggedIn":
            div.innerHTML = "<input type=\"text\" id=\"loginUser\" placeholder=\"Användarnamn\" required><input type=\"password\" id=\"loginPwd\" placeholder=\"Lösenord\" required><button id=\"loginBtn\">Logga in</button>";
            break;
        case "loggedIn":
            div.innerHTML = "<p>Inloggad som: " + getLoggedInUser() + "</p><button id=\"logoutBtn\">Logga ut</button>";
    }
}

/* function renderHTMLMain(view): Renders dynamic content on page depending on state. */
function renderHTMLMain(view){
    const h1 = document.querySelector("main > h1");
    const form = document.getElementById("registerForm");
    let text;
    let displayCreate = "inline-block";
    switch(view){
        case "notLoggedIn":
            text = "Välkommen gäst! Logga in ovan eller registrera dig.";
            break;
        case "loggedOut":
            text = "Du är nu utloggad. Välkommen tillbaks!";
            break;
        case "noSuchUser":
            text = "Användare finns inte. Försök igen eller registrera dig nedan.";
            break;
        case "incorrectCredentials":
            text = "Felaktigt användarnamn eller lösenord!";
            break;
        case "emptyField":
            text = "Du måste fylla i både användarnamn och lösenord!";
            break;
        case "userExists":
            text = "Användare finns redan. Logga in eller försök igen.";
            break;
        case "loggedIn":
            text = "Hej " + getLoggedInUser() + "!";
            displayCreate = "none";
            break;
    }
    h1.innerHTML = text;
    form.style.display = displayCreate;
}

/* function createUser(): Create a new user and login that user. */
function createUser() {
    const createUser = document.getElementById("createUser").value;
    const createPwd = document.getElementById("createPwd").value;
    document.getElementById("createUser").value = "";
    document.getElementById("createPwd").value = "";

    if(createUser.length > 0 && createPwd.length > 0) {
        if(addUser(createUser, createPwd)){
            loginUser(createUser);
            renderHTMLMain("loggedIn");
            renderHTMLHeader("loggedIn");
        } else {
            renderHTMLMain("userExists");     
        } 
    }
    else renderHTMLMain("emptyField");
}

/* function init()): Init application. */
function init(){
    if(!getLoggedInUser()){
        setLoggedInUser(-1);
    }
    
    if(getLoggedInUser() == -1){
        renderHTMLHeader("notLoggedIn");
        renderHTMLMain("notLoggedIn");
    } else{
        renderHTMLHeader("loggedIn");
        renderHTMLMain("loggedIn");
    }

    if(!(getUsers())){
        const userstemp = [{username: "jobry", password: "12345678"}, {username: "fredrik", password: "12345"}, {username: "stina", password: "54321"}, {username: "anna", password: "password"}];
        saveUsers(userstemp);
    }
}

const createUserBtn = document.querySelector("#createUserBtn");
const statusBtn = document.getElementById("statusBtn");

createUserBtn.addEventListener("click", createUser);

document.getElementById("topRightHeader").addEventListener("click",function(e){
    if(e.target && e.target.id == "logoutBtn"){
        logoutUser(getLoggedInUser());
        renderHTMLHeader("notLoggedIn");
        renderHTMLMain("loggedOut");
    } else if (e.target && e.target.id == "loginBtn"){
        const loginUserField = document.getElementById("loginUser");
        const loginPwdField = document.getElementById("loginPwd");
        const loginUsername = loginUserField.value;
        const loginPwd = loginPwdField.value;
        loginUserField.value = "";
        loginPwdField.value = "";

        if(!(loginUsername.length > 0 && loginPwd.length > 0)) {
            renderHTMLMain("emptyField");
            return;
        }

        switch(checkPassword(loginUsername, loginPwd)) {
            case -1:
                renderHTMLMain("noSuchUser");
                break;
            case true:
                loginUser(loginUsername);
                renderHTMLHeader("loggedIn");
                renderHTMLMain("loggedIn");
                break;
            case false:
                renderHTMLMain("incorrectCredentials");
        }
    }
 });

init();


