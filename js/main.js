import { enemies, gateCell, mapVisual, setTimer } from "./map.js";
import { player } from "./player.js";
import { bomb } from "./bomb.js";
import { calcCellSize } from "./responsive.js";
import { setEvents } from "./events.js";
import { checkLoseCondition, checkWinCondition, checkLevelWinCondition } from "./gameProgress.js";

export const gameState = {
    stage: 0,
    enimiesNumber: 3,
    cellSize: calcCellSize(),
    board: document.getElementById('map'),
    timeElement : document.querySelector(".timer span"),
    framesNb : 0,
    movementKeys: [],
    placeBomb: false,
    player: player,
    grid: null,
    gameWon: false,
    gameLost: false,
    isPaused: false,
}

export function gameLoop(currentTime) {
    if (gameState.gameWon || gameState.gameLost || gameState.isPaused) {
        return;
    }

    const sec = Math.floor(gameState.framesNb / 60);
    const minu = Math.floor(sec / 60);
    setTimer(sec, minu, gameState.timeElement);

    if (gameState.movementKeys[0] && gameState.player.alive) {
        const direction = gameState.movementKeys[0].slice(5);
        gameState.player.move(direction, gameState.grid, gameState.cellSize);
        gameState.player.animation(currentTime, direction);
        if (gameState.stage == 2) checkWinCondition(gameState, enemies, gateCell);
        else checkLevelWinCondition(gameState, enemies, gateCell);
    }

    if (!gameState.player.alive || gameState.player.revive) {
        gameState.player.deathAnimation(currentTime)
        checkLoseCondition(gameState);
    }

    if (gameState.player.alive && gameState.placeBomb
        && (gameState.player.currentCell.i != gateCell[0] || gameState.player.currentCell.j != gateCell[1])) {
        bomb.exist = true;
        bomb.create(gameState.cellSize);  
    }

    if (bomb.explode) {
        bomb.explosion(gameState.grid, gameState.cellSize);
        bomb.explode = false;
    }
    gameState.placeBomb = false;

    if (bomb.exist) {
        bomb.animate(currentTime)
    }

    if (enemies.length > 0) {
        enemies.forEach(enemy => {
            // enemy.move(gameState.grid);
            enemy.animate(currentTime);
        })
    }

    gameState.framesNb++;
    requestAnimationFrame(gameLoop)
}

function startGame() {
    setEvents();
    gameState.grid = mapVisual();
    requestAnimationFrame(gameLoop);
}

startGame();
