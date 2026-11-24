
let currentPlayer = 0;
let diceValue = 1;

const players = ["Red", "Green", "Yellow", "Blue"];

function rollDice() {
    diceValue = Math.floor(Math.random() * 6) + 1;

    document.getElementById("dice").textContent =
        ["⚀","⚁","⚂","⚃","⚄","⚅"][diceValue - 1];

    document.getElementById("turn").textContent =
        players[currentPlayer] + " ki baari";

    return diceValue;
}

function nextTurn() {
    if (diceValue !== 6) {
        currentPlayer = (currentPlayer + 1) % players.length;
    }

    document.getElementById("turn").textContent =
        players[currentPlayer] + " ki baari";
}
