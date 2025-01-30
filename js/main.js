import { enemies, gateCell, mapVisual, setTimer } from "./map.js";
import { player } from "./player.js";
import { bomb } from "./bomb.js";
import { calcCellSize } from "./responsive.js";
import { setEvents } from "./events.js";
import { checkLoseCondition, checkWinCondition, checkLevelWinCondition } from "./gameProgress.js";

export const gameState = {
    level: 0,
    enimiesNumber: 1,
    score: 0,
    storyTime: false,
    cellSize: calcCellSize(),
    board:  document.getElementById('map'),
    timeElement :  document.querySelector(".timer span"),
    player: player,
    framesNb : 0,
    movementKeys: [],
    grid: null,
    placeBomb: false,
    gameWon: false,
    gameLost: false,
    isPaused: false,
}

export function gameLoop(currentTime) {
    if (gameState.gameWon || gameState.gameLost || gameState.isPaused || gameState.storyTime) {
        return;
    }

    const sec = Math.floor(gameState.framesNb / 60);
    const minu = Math.floor(sec / 60);
    setTimer(sec, minu, gameState.timeElement);

    if (gameState.movementKeys[0] && gameState.player.alive) {
        gameState.player.move(gameState.movementKeys[0].slice(5), gameState.grid);
        gameState.player.animation(currentTime, gameState.movementKeys[0].slice(5));

        // those to be optimized
        if (gameState.stage == 2) checkWinCondition(gameState, enemies, gateCell);
        else checkLevelWinCondition(gameState, enemies, gateCell);
    }

    if (!gameState.player.alive || gameState.player.revive) {
        gameState.player.deathAnimation(currentTime)
        checkLoseCondition(gameState);
    }

    if (!bomb.exist && gameState.player.alive && gameState.placeBomb && (gameState.player.currentCell.i != gateCell[0] || gameState.player.currentCell.j != gateCell[1])) {
        gameState.placeBomb = false;
        bomb.exist = true;
        bomb.create(currentTime);
    }

    if (bomb.exist) {
        bomb.animate(currentTime);
    }

    if (bomb.createTime && currentTime - bomb.createTime >= 1500){
        bomb.explosion(gameState.grid, gameState.cellSize);
        bomb.exist = false;
    }

    if (enemies.length > 0) {
        enemies.forEach(enemy => {
            enemy.move(gameState.grid);
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
