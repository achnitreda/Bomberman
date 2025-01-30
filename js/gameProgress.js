import { gameLoop, gameState } from "./main.js";
import { mapVisual, setNbOfHearts } from "./map.js";
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
    const map = document.getElementById('map');
    map.innerHTML = '';
    gameState.level++;
    gameState.enimiesNumber += 2;
    player.lifes++;
    player.element.style.backgroundPosition = `0px 0px`;
    player.currentCell.i = 1;
    player.currentCell.j = 1;
    gameState.grid = mapVisual();
    setNbOfHearts(player.lifes);
    requestAnimationFrame(gameLoop);
}

function checkWinCondition(gameState, enemies, gateCell) {
    if (enemies.length === 0 &&
        gameState.player.currentCell.i === gateCell[0] &&
        gameState.player.currentCell.j === gateCell[1]) {
        gameState.gameWon = true;
        showWinScreen();
    }
}

function checkLevelWinCondition(gameState, enemies, gateCell) {
    if (enemies.length === 0 &&
        gameState.player.currentCell.i === gateCell[0] &&
        gameState.player.currentCell.j === gateCell[1]) {
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