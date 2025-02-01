import { gateCell, mapVisual, setTimer, logoMove } from "./map.js";
import { player } from "./player.js";
import { bomb } from "./bomb.js";
import { calcCellSize } from "./responsive.js";
import { setEvents } from "./events.js";
import { checkLoseCondition, checkWinCondition, checkLevelWinCondition } from "./gameProgress.js";

export const gameState = {
    level: 0,
    enimiesNumber: 3,
    enemies: [],
    score: 0,
    storyTime: false,
    cellSize: calcCellSize(),
    board: document.getElementById('map'),
    timeElement: document.querySelector(".timer span"),
    player: player,
    framesNb: 0,
    movementKeys: [],
    grid: null,
    placeBomb: false,
    gameWon: false,
    gameLost: false,
    isPaused: false,
}

export function gameLoop(currentTime) {
    if (!gameState.gameWon && !gameState.gameLost && !gameState.isPaused && !gameState.storyTime) {
        const sec = Math.floor(gameState.framesNb / 60);
        const minu = Math.floor(sec / 60);
        setTimer(sec, minu, gameState.timeElement);

        if (gameState.movementKeys[0] && player.alive) {
            player.move(gameState.movementKeys[0].slice(5), gameState.grid);
            player.animation(currentTime, gameState.movementKeys[0].slice(5));

            // those to be optimized
            if (gameState.stage == 2) checkWinCondition(gameState, gameState.enemies, gateCell);
            else checkLevelWinCondition(gameState, gameState.enemies, gateCell);
        }

        // player death animation
        if (!player.alive || player.revive) {
            checkLoseCondition(gameState);
            player.deathAnimation(currentTime);
        }

        // after death period
        if (player.deathTime && (currentTime - player.deathTime >= 2000)) {
            player.alive = true;
            player.revive = true;
            player.deathTime = null;
            player.reviveTime = currentTime
            player.element.style.transform = `translate(${player.position.x}px, ${player.position.y}px)`;
        }

        // after revive period 
        if (player.reviveTime && (currentTime - player.reviveTime >= 2000)) {
            player.element.classList.add('opacity1');
            player.revive = false;
            player.reviveTime = null;
        }

        // create and place a bomb
        if (!bomb.exist && player.alive && gameState.placeBomb &&
            ((player.position.y + (player.size * 0.5)) / gameState.cellSize != gateCell[0] || (player.position.x + (player.size * 0.5)) / gameState.cellSize != gateCell[1])) {
            gameState.placeBomb = false;
            bomb.exist = true;
            bomb.create(currentTime);
        }

        // bomb animation
        if (bomb.exist) {
            bomb.animate(currentTime);
        }

        // bomb explosion
        if (bomb.createTime && currentTime - bomb.createTime >= 1500) {
            bomb.explosion(gameState.grid, gameState.cellSize, currentTime);
            bomb.exist = false;
        }

        // enemies
        if (gameState.enemies.length > 0) {
            gameState.enemies.forEach(enemy => {
                enemy.move(gameState.grid, currentTime);
                enemy.animate(currentTime);
            })
        }
        gameState.framesNb++;
    }

    logoMove(currentTime);
    requestAnimationFrame(gameLoop);
}

function startGame() {
    setEvents();
    gameState.grid = mapVisual();
    requestAnimationFrame(gameLoop);
}

startGame();
