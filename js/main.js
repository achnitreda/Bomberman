import { gateCell, mapVisual } from "./map.js";
import { player } from "./player.js";
import { bomb } from "./bomb.js";
const board = document.getElementById('board')
const grid = mapVisual(board, player);
const movementkeys = [];


function gameLoop() {
    if (movementkeys[0] != undefined) {
        player.move(movementkeys[0].slice(5), grid);
    }

    requestAnimationFrame(gameLoop)
}


document.addEventListener("keydown", (e) => {
    if (e.key == "ArrowUp" || e.key == "ArrowLeft" || e.key == "ArrowRight" || e.key == "ArrowDown") {
        if (!movementkeys.includes(e.key)) {
            movementkeys.unshift(e.key)
        }
    }
})

document.addEventListener("keyup", (e) => {
    if (e.key == "ArrowUp" || e.key == "ArrowLeft" || e.key == "ArrowRight" || e.key == "ArrowDown") {
        movementkeys.splice(movementkeys.indexOf(e.key), 1)
    }
})

requestAnimationFrame(gameLoop)

document.addEventListener("keypress", e => {
    if (e.key.toLowerCase() == 'z') {
        if (!bomb.exist && (player.currentCell.i != gateCell[0] || player.currentCell.j != gateCell[1])) {
            bomb.exist = true;
            bomb.create();
            bomb.explosion(grid)
        }
    }
})