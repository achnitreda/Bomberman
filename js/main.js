import { enemies, enemiesIndexes, gateCell, mapVisual, setTimer } from "./map.js";
import { player } from "./player.js";
import { bomb } from "./bomb.js";
import { calcCellSize, handleResize } from "./responsive.js";

export const gameState = {
    cellSize: calcCellSize(),
    board: document.getElementById('board'),
    movementKeys: [],
    placeBomb: false,
    player: player,
    grid: null,
    gameWon: false,
    gameLost: false
}

function showWinScreen() {
    const winScreen = document.getElementById('win-screen');
    winScreen.classList.remove('hidden');
}

function checkWinCondition() {
    if (enemiesIndexes.length === 0 &&
        player.currentCell.i === gateCell[0] &&
        player.currentCell.j === gateCell[1] &&
        !gameState.gameWon) {

        gameState.gameWon = true;
        showWinScreen()
        return true
    }
    return false
}

function showLoseScreen() {
    const loseScreen = document.getElementById('lose-screen');
    loseScreen.classList.remove('lose-hidden');
}

function checkLoseCondition() {
    if (gameState.player.lifes === 0 && !gameState.gameLost) {
        gameState.gameLost = true;
        showLoseScreen();
        return true;
    }
    return false;
}

gameState.grid = mapVisual(gameState.board, gameState.player, gameState.cellSize);

const timeElement = document.querySelector(".timer span");
let frameNb = 0;

window.addEventListener('resize', () => handleResize(gameState));

function gameLoop(currentTime) {
    if (gameState.gameWon || gameState.gameLost) {
        return;
    }

    const sec = Math.floor(frameNb / 60);
    const minu = Math.floor(sec / 60);
    setTimer(sec, minu, timeElement);

    if (gameState.movementKeys[0] && gameState.player.alive) {
        const direction = gameState.movementKeys[0].slice(5);
        gameState.player.move(direction, gameState.grid, gameState.cellSize);
        gameState.player.animation(currentTime, direction);

        checkWinCondition()
    }

    if (!gameState.player.alive || gameState.player.revive) {
        gameState.player.deathAnimation(currentTime)
        checkLoseCondition();
    }

    if (gameState.player.alive && gameState.placeBomb
        && (gameState.player.currentCell.i != gateCell[0] || gameState.player.currentCell.j != gateCell[1])) {
        bomb.exist = true;
        bomb.create(gameState.cellSize);
        bomb.explosion(gameState.grid, gameState.cellSize);
    }
    gameState.placeBomb = false;

    if (bomb.exist) {
        bomb.animate(currentTime)
    }

    if (enemies.length > 0) {
        enemies.forEach(enemy => {
            enemy.move(gameState.grid);
            enemy.animate(currentTime);
        })
    }

    frameNb++;
    requestAnimationFrame(gameLoop)
}

document.addEventListener("keydown", (e) => {
    if (gameState.gameWon || gameState.gameLost) {
        return;
    }

    if (e.key.startsWith('Arrow')) {
        if (!gameState.movementKeys.includes(e.key)) {
            gameState.movementKeys.unshift(e.key);
        }
    }
})

document.addEventListener("keyup", (e) => {
    if (gameState.gameWon || gameState.gameLost) {
        return;
    }

    if (e.key.startsWith('Arrow')) {
        gameState.movementKeys.splice(gameState.movementKeys.indexOf(e.key), 1)
    }
})

document.addEventListener("keypress", e => {
    if (gameState.gameWon || gameState.gameLost) {
        return;
    }

    if (e.key.toLowerCase() == 'z') {
        if (!bomb.exist && gameState.player.alive) gameState.placeBomb = true;
    }
})

requestAnimationFrame(gameLoop)
