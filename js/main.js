import { enemies, gateCell, mapVisual } from "./map.js";
import { player } from "./player.js";
import { bomb } from "./bomb.js";
import { calcCellSize } from "./responsive.js";

export const cellSize = calcCellSize();
const board = document.getElementById('board')
const grid = mapVisual(board, player, cellSize);
const movementkeys = [];

let placeBombe = false;


function gameLoop(time) {
    if (movementkeys[0] != undefined && player.alive) {
        const direction = movementkeys[0].slice(5);
        player.move(direction, grid, cellSize);
        player.animation(time, direction);
    }

    if (!player.alive || player.revive) player.deathAnimation(time)

    if (player.alive && placeBombe && (player.currentCell.i != gateCell[0] || player.currentCell.j != gateCell[1])) {
        placeBombe = false;
        bomb.exist = true;
        bomb.create(cellSize);
        bomb.explosion(grid);
    } else {
        placeBombe = false;
    }

    if (bomb.exist) {
        bomb.animate(time)
    }

    if (enemies.length != 0) {
        enemies.forEach(enemy => {
            enemy.move(grid);
            enemy.animate(time);
        })
    }
    requestAnimationFrame(gameLoop)
}

document.addEventListener("keydown", (e) => {
    if (e.key.startsWith('Arrow')) {
        if (!movementkeys.includes(e.key)) {
            movementkeys.unshift(e.key);
        }
    }
})

document.addEventListener("keyup", (e) => {
    if (e.key.startsWith('Arrow')) {
        movementkeys.splice(movementkeys.indexOf(e.key), 1)
    }
})

requestAnimationFrame(gameLoop)

document.addEventListener("keypress", e => {
    if (e.key.toLowerCase() == 'z') {
        if (!bomb.exist && player.alive) placeBombe = true;
    }
})