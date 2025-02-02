import { gameLoop, gameState } from "./main.js";
import { logoMove, mapVisual, setNbOfHearts } from "./map.js";
import { player } from "./player.js";

function showWinScreen() {
    const winScreen = document.getElementById('win-screen');
    winScreen.classList.remove('hidden');
}

function showLevelWinScreen() {
    const winScreen = document.getElementById('level-win');
    winScreen.classList.remove('hidden');
    gameState.storyTime = true;
}

function showLoseScreen() {
    const loseScreen = document.getElementById('lose-screen');
    loseScreen.classList.remove('lose-hidden');
}

function startNewLevel() {
    gameState.storyTime = false;
    gameState.movementKeys = [];
    gameState.board.innerHTML = '';
    gameState.level++;
    gameState.enimiesNumber += 2;
    gameState.enemiesNb = gameState.enimiesNumber;
    player.lifes++;
    player.element.style.backgroundPosition = `0px 0px`;
    gameState.grid = mapVisual();
    setNbOfHearts(player.lifes);
}

function checkWinCondition(gameState, enemies, gateCell) {
    if (Math.trunc((player.position.y + (player.size*0.5))/ gameState.cellSize) === gateCell[0] &&
        Math.trunc((player.position.x + (player.size*0.5))/ gameState.cellSize) === gateCell[1]) {
        gameState.gameWon = true;
        showWinScreen();
    }
}

function checkLevelWinCondition(gameState, enemies, gateCell) {
    if (Math.trunc((player.position.y + (player.size*0.5))/ gameState.cellSize) === gateCell[0] &&
        Math.trunc((player.position.x + (player.size*0.5))/ gameState.cellSize) === gateCell[1]) {
        showLevelWinScreen();
    }
}

function checkLoseCondition(gameState) {
    if (gameState.player.lifes === 0) {
        gameState.gameLost = true;
        showLoseScreen();
    }
}

export { checkLoseCondition, checkWinCondition, checkLevelWinCondition, startNewLevel }