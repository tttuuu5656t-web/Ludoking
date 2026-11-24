
let currentPlayer = 0;
let diceValue = 1;
let canRoll = true;

const players = ["Red", "Green", "Yellow", "Blue"];

const diceFaces = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

function rollDice() {
    if (!canRoll) return;

    diceValue = Math.floor(Math.random() * 6) + 1;

    document.getElementById("dice").textContent =
        diceFaces[diceValue - 1];

    document.getElementById("turn").textContent =
        players[currentPlayer] + " ki baari - " + diceValue;

    canRoll = false;
}

function nextTurn() {
    if (canRoll) {
        alert("Pehle dice roll karo!");
        return;
    }

    if (diceValue !== 6) {
        currentPlayer = (currentPlayer + 1) % players.length;
    }

    document.getElementById("turn").textContent =
        players[currentPlayer] + " ki baari";

    canRoll = true;
}
