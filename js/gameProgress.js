import { gameLoop, gameState } from "./main.js";
import { mapVisual } from "./map.js";
import { player } from "./player.js";

function showWinScreen() {
    const winScreen = document.getElementById('win-screen');
    winScreen.classList.remove('hidden');
}

function showLevelWinScreen() {
    const winScreen = document.getElementById('level-win');
    winScreen.classList.remove('hidden');
}

function showLoseScreen() {
    const loseScreen = document.getElementById('lose-screen');
    loseScreen.classList.remove('lose-hidden');
}

function startNewStage() {
    const map = document.getElementById('map');
    map.innerHTML = '';

    
    gameState.stage++;
    gameState.enimiesNumber += 2;
    player.element.style.backgroundPosition = `0px 0px`;
    // player.position.x = gameState.cellSize + Math.floor((gameState.cellSize - player.size) * 0.5);
    // player.position.y = gameState.cellSize + Math.floor((gameState.cellSize - player.size) * 0.5);
    player.currentCell.i = 1;
    player.currentCell.j = 1;
    gameState.grid = mapVisual();
    // player.element.style.transform = `translate(${player.position.x}px, ${player.position.y}px)`;
    requestAnimationFrame(gameLoop);
}

function checkWinCondition(gameState, enemies, gateCell) {
    if (enemies.length === 0 &&
        gameState.player.currentCell.i === gateCell[0] &&
        gameState.player.currentCell.j === gateCell[1] &&
        gameState.stage === 2) {

        gameState.gameWon = true;
        showWinScreen();
        return true
    }
    return false
}

function checkLevelWinCondition(gameState, enemies, gateCell) {
    if (enemies.length === 0 &&
        gameState.player.currentCell.i === gateCell[0] &&
        gameState.player.currentCell.j === gateCell[1]) {

        showLevelWinScreen();
        return true
    }
}

function checkLoseCondition(gameState) {
    if (gameState.player.lifes === 0) {
        gameState.gameLost = true;
        showLoseScreen();
        return true;
    }
    return false;
}

export { checkLoseCondition, checkWinCondition, checkLevelWinCondition, startNewStage }