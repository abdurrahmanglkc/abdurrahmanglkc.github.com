const menu = document.getElementById("menu");
const game = document.getElementById("game");
const startGameButton = document.getElementById("startGame");

const board = document.getElementById("board");
const playerXWinsElement = document.getElementById("playerXWins");
const playerOWinsElement = document.getElementById("playerOWins");
const tiesElement = document.getElementById("ties");
const difficultySelect = document.getElementById("difficulty-select");

let gameBoard = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let playerXWins = 0;
let playerOWins = 0;
let ties = 0;

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Oyuna başla butonuna tıklama işleyicisi
startGameButton.addEventListener("click", () => {
    menu.style.display = "none";
    game.style.display = "block";
    createBoard();
});

// Oyun tahtasını oluştur
function createBoard() {
    board.innerHTML = "";
    gameBoard.forEach((cell, index) => {
        const cellElement = document.createElement("div");
        cellElement.classList.add("cell");
        cellElement.dataset.index = index;
        cellElement.innerText = cell;
        cellElement.addEventListener("click", onCellClick);
        board.appendChild(cellElement);
    });
}

// Hücreye tıklama işleyicisi
function onCellClick(event) {
    const index = event.target.dataset.index;
    if (gameBoard[index] === "" && currentPlayer === "X") {
        gameBoard[index] = currentPlayer;
        currentPlayer = "O";
        createBoard();
        if (!checkWin(gameBoard, "X") && !checkTie()) {
            setTimeout(() => {
                aiMove();
                createBoard();
                if (checkWin(gameBoard, "O")) {
                    playerOWins++;
                    playerOWinsElement.innerText = playerOWins;
                } else if (checkTie()) {
                    ties++;
                    tiesElement.innerText = ties;
                }
            }, 500);
        } else if (checkWin(gameBoard, "X")) {
            playerXWins++;
            playerXWinsElement.innerText = playerXWins;
        } else if (checkTie()) {
            ties++;
            tiesElement.innerText = ties;
        }
    }
}

// AI hamlesi
function aiMove() {
    let bestMove;
    const difficulty = difficultySelect.value;

    if (difficulty === "easy") {
        bestMove = easyMove();
    } else if (difficulty === "medium") {
        bestMove = mediumMove();
    } else {
        bestMove = minimax(gameBoard, "O").index;
    }

    gameBoard[bestMove] = "O";
    currentPlayer = "X";
}

// Kolay seviye: Rastgele hamle
function easyMove() {
    const availableSpots = gameBoard.map((cell, index) => cell === "" ? index : null).filter(val => val !== null);
    return availableSpots[Math.floor(Math.random() * availableSpots.length)];
}

// Orta seviye: Basit bir strateji veya rastgele hamle
function mediumMove() {
    if (Math.random() < 0.5) {
        return easyMove();
    } else {
        return minimax(gameBoard, "O").index;
    }
}

// Kazananı kontrol et
function checkWin(board, player) {
    let win = false;
    winningCombinations.forEach((combination) => {
        if (board[combination[0]] === player && 
            board[combination[1]] === player && 
            board[combination[2]] === player) {
            win = true;
            alert(player + " kazandı!");
            resetGame();
        }
    });
    return win;
}

// Beraberliği kontrol et
function checkTie() {
    if (!gameBoard.includes("")) {
        alert("Berabere!");
        resetGame();
        return true;
    }
    return false;
}

// Minimax algoritması
function minimax(newBoard, player) {
    const availSpots = newBoard.reduce((acc, cell, index) => 
        cell === "" ? acc.concat(index) : acc, []);

    if (checkWin(newBoard, "X")) {
        return { score: -10 };
    } else if (checkWin(newBoard, "O")) {
        return { score: 10 };
    } else if (availSpots.length === 0) {
        return { score: 0 };
    }

    const moves = [];

    availSpots.forEach((spot) => {
        const move = {};
        move.index = spot;
        newBoard[spot] = player;

        if (player === "O") {
            const result = minimax(newBoard, "X");
            move.score = result.score;
        } else {
            const result = minimax(newBoard, "O");
            move.score = result.score;
        }

        newBoard[spot] = "";
        moves.push(move);
    });

    let bestMove;
    if (player === "O") {
        let bestScore = -10000;
        moves.forEach((move, i) => {
            if (move.score > bestScore) {
                bestScore = move.score;
                bestMove = i;
            }
        });
    } else {
        let bestScore = 10000;
        moves.forEach((move, i) => {
            if (move.score < bestScore) {
                bestScore = move.score;
                bestMove = i;
            }
        });
    }

    return moves[bestMove];
}

// Oyunu sıfırla
function resetGame() {
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    createBoard();
}

// Oyunun başlangıç ekranını göster
menu.style.display = "flex";
