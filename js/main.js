import { gateCell, mapVisual, setTimer, logoMove } from "./map.js";
import { player } from "./player.js";
import { bomb } from "./bomb.js";
import { calcCellSize } from "./responsive.js";
import { setEvents } from "./events.js";
import { checkLoseCondition, checkWinCondition, checkLevelWinCondition } from "./gameProgress.js";

export const gameState = {
    level: 0,
    enimiesNumber: 3,
    enemiesNb: 3,
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
        const sec = Math.trunc(gameState.framesNb / 60);
        const minu = Math.trunc(sec / 60);
        setTimer(sec, minu, gameState.timeElement);

        if (gameState.movementKeys[0] && player.alive) {
            player.move(gameState.movementKeys[0].slice(5), gameState.grid);
            player.animation(currentTime, gameState.movementKeys[0].slice(5));


            if (gameState.level == 2 && gameState.enemiesNb == 0) checkWinCondition(gameState, gameState.enemies, gateCell);
            else if (gameState.enemiesNb == 0) checkLevelWinCondition(gameState, gameState.enemies, gateCell);
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
        if (gameState.enemiesNb > 0) {
            gameState.enemies.forEach(enemy => {
                 if (enemy != null) {
                    enemy.move(gameState.grid, currentTime);
                    enemy.animate(currentTime);
                }
            })
        }
        gameState.framesNb++;
    }

    logoMove(currentTime);
    requestAnimationFrame(gameLoop);
}

document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-btn');
    if (startButton) {
      startButton.addEventListener('click', startGame);
    }
});

function startGame() {
    const startScreen = document.querySelector('.start-screen');
    if (startScreen) {
        startScreen.classList.add('hidden');
    }

    setEvents();
    gameState.grid = mapVisual();
    
    // Show intro popup
    setTimeout(() => {
        const introPopup = document.getElementById('intro-popup');
        introPopup.classList.remove('hidden');
        gameState.storyTime = true;
    }, 500);

    requestAnimationFrame(gameLoop);
}