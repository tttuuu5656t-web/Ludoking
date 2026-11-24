
const socket = io();

const nameInput = document.getElementById("playerName");
const codeInput = document.getElementById("roomCode");
const createBtn = document.getElementById("createBtn");
const joinBtn = document.getElementById("joinBtn");
const message = document.getElementById("message");
const roomPanel = document.getElementById("roomPanel");
const roomCodeDisplay = document.getElementById("roomCodeDisplay");
const playerList = document.getElementById("playerList");

let currentRoom = null;

function showMessage(text) {
    message.textContent = text;
}

function displayRoom(room) {
    currentRoom = room;
    roomPanel.classList.remove("hidden");
    roomCodeDisplay.textContent = room.code;

    playerList.innerHTML = "";

    room.players.forEach(player => {
        const li = document.createElement("li");
        li.textContent = player.name + " - " + player.color;
        playerList.appendChild(li);
    });

    showMessage("Room connected successfully!");
}

createBtn.addEventListener("click", () => {
    const name = nameInput.value.trim();

    if (!name) {
        showMessage("Pehle apna naam likho.");
        return;
    }

    createBtn.disabled = true;

    socket.emit("createRoom", name, result => {
        createBtn.disabled = false;

        if (result.error) {
            showMessage(result.error);
            return;
        }

        displayRoom(result.room);
    });
});

joinBtn.addEventListener("click", () => {
    const name = nameInput.value.trim();
    const code = codeInput.value.trim();

    if (!name || !code) {
        showMessage("Naam aur Room Code likho.");
        return;
    }

    joinBtn.disabled = true;

    socket.emit("joinRoom", { name, code }, result => {
        joinBtn.disabled = false;

        if (result.error) {
            showMessage(result.error);
            return;
        }

        displayRoom(result.room);
    });
});

socket.on("roomUpdated", room => {
    if (currentRoom && currentRoom.code === room.code) {
        displayRoom(room);
    }
});

socket.on("connect", () => {
    showMessage("Server connected. Game ready!");
});

socket.on("disconnect", () => {
    showMessage("Server disconnected. Reconnecting...");
});
