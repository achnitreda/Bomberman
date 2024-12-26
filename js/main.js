import { mapVisual, gateCell } from "./map.js";
import { player } from "./player.js";
const movementkeys = [];
const board = document.getElementById('board')
const grid = mapVisual(board, player);


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
        const bombCell = document.getElementById(`cell${player.currentCell.i}#${player.currentCell.j}`);
        const bomb = document.createElement("div");
        const i = player.currentCell.i;
        const j = player.currentCell.j;
        // console.log(player.cell);

        bomb.classList.add("bomb");
        bombCell.appendChild(bomb);
        setTimeout(() => {
            const bombRight = document.getElementById(`cell${i}#${j + 1}`);
            // console.log(bombRight);

            const bombLeft = document.getElementById(`cell${i}#${j - 1}`);
            const bombTop = document.getElementById(`cell${i - 1}#${j}`);
            const bombBottom = document.getElementById(`cell${i + 1}#${j}`);
            // console.log(bombRight);


            if (bombRight.classList.contains("softWall")) {
                bombRight.classList.remove("softWall");
                bombRight.classList.add("empty")
                grid[i][j + 1] = 0;
                if (i == gateCell[0] && j+1 == gateCell[1]) {
                    bombRight.classList.add("gate") 
                }
            }
            if (bombLeft.classList.contains("softWall")) {
                bombLeft.classList.remove("softWall");
                bombLeft.classList.add("empty")
                grid[i][j - 1] = 0;
                if (i == gateCell[0] && j-1 == gateCell[1]) {
                    bombLeft.classList.add("gate") 
                }
            }
            if (bombTop.classList.contains("softWall")) {
                bombTop.classList.remove("softWall");
                bombTop.classList.add("empty")
                grid[i - 1][j] = 0;
                if (i-1 == gateCell[0] && j == gateCell[1]) {
                    bombTop.classList.add("gate") 
                }
            }
            if (bombBottom.classList.contains("softWall")) {
                bombBottom.classList.remove("softWall");
                bombBottom.classList.add("empty")
                grid[i + 1][j] = 0;
                if (i+1 == gateCell[0] && j == gateCell[1]) {
                    bombBottom.classList.add("gate") 
                }
            }
            // player.updateNeighborCells(grid)
            bomb.remove()
            if (player.currentCell.i == i && player.currentCell.j == j ||
                player.currentCell.i == i && player.currentCell.j == j + 1 ||
                player.currentCell.i == i && player.currentCell.j == j - 1 ||
                player.currentCell.i == i - 1 && player.currentCell.j == j ||
                player.currentCell.i == i + 1 && player.currentCell.j == j
            ) {
                player.element.style.background = "red";
                setTimeout(() => {
                    // send to initial position
                    player.position.x -=  player.position.x;
                    player.position.y -=  player.position.y;
                    player.currentCell.i = 1;
                    player.currentCell.j = 1;
                    player.targetCell.i = 1;
                    player.targetCell.j = 1;
                    player.updateBounds(grid)
                    
                    player.element.style.transform = `translate(${-player.position.x}px, ${player.position.y}px)`;
                    player.element.style.background = "aqua";
                },1000)

            }
        }, 2000)
    }
})

// player.updateBounds(grid   )