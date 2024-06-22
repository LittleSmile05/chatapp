let socket = io();
let form = document.getElementById('form');
let myname = document.getElementById('myname');
let message = document.getElementById('message');
let messageArea = document.getElementById("messageArea");

let userNumber = localStorage.getItem("userNumber") || 1;

function displayMessages(messages) {
    messages.forEach((data, index) => {
        let messageContainer = document.createElement("div");
        let messageClass = (data.username === "gunel") ? "left" : "right";
        messageContainer.classList.add("message-container", messageClass);

        let usernameElement = document.createElement("div");
        usernameElement.classList.add("username");
        usernameElement.textContent = data.username;

        let messageContent = document.createElement("div");
        messageContent.classList.add("message");
        messageContent.textContent = data.message;

        let timestamp = document.createElement("div");
        timestamp.classList.add("timestamp");
        timestamp.textContent = new Date(data.timestamp).toLocaleTimeString(); 

        messageContainer.appendChild(usernameElement);
        messageContainer.appendChild(messageContent);
        messageContainer.appendChild(timestamp); 

        messageArea.appendChild(messageContainer);
    });
}

// Listen for past messages from the server
socket.on("past messages", (pastMessages) => {
    displayMessages(pastMessages);
});

form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (message.value) {
        socket.emit('send message', { username: myname.value, message: message.value, timestamp: Date.now(), userNumber: userNumber });
        message.value = "";
    }
});

socket.on("send message", (data) => {
    let messageContainer = document.createElement("div");
    let messageClass = (data.username === "gunel") ? "left" : "right";
    messageContainer.classList.add("message-container", messageClass);

    let usernameElement = document.createElement("div");
    usernameElement.classList.add("username");
    usernameElement.textContent = data.username;

    let messageContent = document.createElement("div");
    messageContent.classList.add("message");
    messageContent.textContent = data.message;

    let timestamp = document.createElement("div");
    timestamp.classList.add("timestamp");
    timestamp.textContent = new Date(data.timestamp).toLocaleTimeString(); 

    messageContainer.appendChild(usernameElement);
    messageContainer.appendChild(messageContent);
    messageContainer.appendChild(timestamp); 
    messageArea.appendChild(messageContainer);
});
