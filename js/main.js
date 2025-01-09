import { enemies, gateCell, mapVisual } from "./map.js";
import { player, urgentMove } from "./player.js";
import { bomb } from "./bomb.js";
import { calcCellSize } from "./responsive.js";

export const cellSize = calcCellSize();
const board = document.getElementById('board')
const grid = mapVisual(board, player, cellSize);
const movementkeys = [];
let placeBombe = false;

// console.log(cellSize);


function gameLoop(time) {

    if (movementkeys[0] != undefined && player.alive) {
        player.move(urgentMove || movementkeys[0].slice(5), grid, cellSize);
        player.animation(time, urgentMove || movementkeys[0].slice(5));
    }

    if (!player.alive || player.revive) player.deathAnimation(time)

    if (player.alive && placeBombe && (player.currentCell.i != gateCell[0] || player.currentCell.j != gateCell[1])) {
        placeBombe = false;
        bomb.exist = true;
        bomb.create(cellSize);
        bomb.explosion(grid);
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
    if (e.key == "ArrowUp" || e.key == "ArrowLeft" || e.key == "ArrowRight" || e.key == "ArrowDown") {
        if (!movementkeys.includes(e.key)) {
            movementkeys.unshift(e.key);
        }
        if (movementkeys.length != 0) {
            player.sprite.animate = true;
        }
    }
})

document.addEventListener("keyup", (e) => {
    if (e.key == "ArrowUp" || e.key == "ArrowLeft" || e.key == "ArrowRight" || e.key == "ArrowDown") {
        movementkeys.splice(movementkeys.indexOf(e.key), 1)
    }

    if (movementkeys.length == 0) {
        player.sprite.animate = false;
    }
})

requestAnimationFrame(gameLoop)

document.addEventListener("keypress", e => {
    if (e.key.toLowerCase() == 'z') {
        if (!bomb.exist && player.alive) placeBombe = true;
    }
})