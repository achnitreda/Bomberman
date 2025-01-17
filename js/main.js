import { enemies, gateCell, mapVisual } from "./map.js";
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
}

gameState.grid = mapVisual(gameState.board, gameState.player, gameState.cellSize);

window.addEventListener('resize', () => handleResize(gameState));

function gameLoop(currentTime) {

    if (gameState.movementKeys[0] && gameState.player.alive) {
        const direction = gameState.movementKeys[0].slice(5);
        gameState.player.move(direction, gameState.grid, gameState.cellSize);
        gameState.player.animation(currentTime, direction);
    }

    if (!gameState.player.alive || gameState.player.revive) {
        gameState.player.deathAnimation(currentTime)
    }

    if (gameState.player.alive && gameState.placeBomb
        && (gameState.player.currentCell.i != gateCell[0] || gameState.player.currentCell.j != gateCell[1])) {
        bomb.exist = true;
        bomb.create(gameState.cellSize);
        bomb.explosion(gameState.grid,gameState.cellSize);
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

    requestAnimationFrame(gameLoop)
}

document.addEventListener("keydown", (e) => {
    if (e.key.startsWith('Arrow')) {
        if (!gameState.movementKeys.includes(e.key)) {
            gameState.movementKeys.unshift(e.key);
        }
    }
})

document.addEventListener("keyup", (e) => {
    if (e.key.startsWith('Arrow')) {
        gameState.movementKeys.splice(gameState.movementKeys.indexOf(e.key), 1)
    }
})

document.addEventListener("keypress", e => {
    if (e.key.toLowerCase() == 'z') {
        if (!bomb.exist && gameState.player.alive) gameState.placeBomb = true;
    }
})

requestAnimationFrame(gameLoop)
