import { mapVisual } from "./map.js";
import { player, animation } from "./player.js";
const board = document.getElementById('board')
const grid = mapVisual(board, player);
// const keys = { ArrowRight: false, ArrowLeft: false, ArrowDown: false, ArrowUp: false };



// console.log(player.neighborCells);




document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
        // keys[e.key] = true;
        if (!animation.id) {
            animation.id = requestAnimationFrame(() => player.moveRight(grid))
        }
    }

    if (e.key === "ArrowLeft") {
        // keys[e.key] = true;
        if (!animation.id) {
            animation.id = requestAnimationFrame(() => player.moveLeft(grid))
        }
    }

    if (e.key === "ArrowDown") {
        // keys[e.key] = true;
        if (!animation.id) {
            animation.id = requestAnimationFrame(() => player.moveDown(grid))
        }
    }

    if (e.key === "ArrowUp") {
        // keys[e.key] = true;
        if (!animation.id) {
            animation.id = requestAnimationFrame(() => player.moveUp(grid))
        }
    }
});

document.addEventListener("keyup", (e) => {
    // if (keys[e.key] != undefined) {
        // keys[e.key] = false;
        // if (!Object.values(keys).some(Boolean)) {
            cancelAnimationFrame(animation.id);
            animation.id = null;
        // }
    // }

})

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
            console.log(bombRight);

            const bombLeft = document.getElementById(`cell${i}#${j - 1}`);
            const bombTop = document.getElementById(`cell${i - 1}#${j}`);
            const bombBottom = document.getElementById(`cell${i + 1}#${j}`);
            // console.log(bombRight);


            if (bombRight.classList.contains("softWall")) {
                bombRight.classList.remove("softWall");
                bombRight.classList.add("empty")
                grid[i][j + 1] = 0;
            }
            if (bombLeft.classList.contains("softWall")) {
                bombLeft.classList.remove("softWall");
                bombLeft.classList.add("empty")
                grid[i][j - 1] = 0;
            }
            if (bombTop.classList.contains("softWall")) {
                bombTop.classList.remove("softWall");
                bombTop.classList.add("empty")
                grid[i - 1][j] = 0;
            }
            if (bombBottom.classList.contains("softWall")) {
                bombBottom.classList.remove("softWall");
                bombBottom.classList.add("empty")
                grid[i + 1][j] = 0;
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
                },200)

            }
        }, 2000)
    }
})

// player.updateBounds(grid   )