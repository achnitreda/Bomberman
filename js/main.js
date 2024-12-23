import { mapVisual } from "./map.js";
import { player, animation } from "./player.js";
const board = document.getElementById('board')




const grid = mapVisual(board, player);
console.log(player.neighborCells);


document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
        if (!animation.id) {
            animation.id = requestAnimationFrame(() => player.moveRight(grid))
        }
    }

    // if (e.key === "ArrowLeft") {
    //     if (!animation.id) {
    //         animation.id = requestAnimationFrame(() => player.moveLeft(grid))
    //     }
    // }
});

document.addEventListener("keyup", () => {
    cancelAnimationFrame(animation.id);
    animation.id = null;
})

document.addEventListener("keypress", e => {
    if (e.key.toLowerCase() == 'z') {
        const bombCell = document.getElementById(`cell${player.cell.i}#${player.cell.j}`);
        const bomb = document.createElement("div");
        const i = player.cell.i;
        const j = player.cell.j;
        console.log(player.cell);
        
        bomb.classList.add("bomb");
        bombCell.appendChild(bomb);
        setTimeout(()=> {
            const bombRight = document.getElementById(`cell${i}#${j+1}`);
            console.log(bombRight);
            
            const bombLeft = document.getElementById(`cell${i}#${j-1}`);
            const bombTop = document.getElementById(`cell${i-1}#${j}`);
            const bombBottom = document.getElementById(`cell${i+1}#${j}`);
            // console.log(bombRight);
            

            if (bombRight.classList.contains("softWall")) {
                bombRight.classList.remove("softWall");
                bombRight.classList.add("empty")
                grid[i][j+1] = 0;                
            }
            if (bombLeft.classList.contains("softWall")) {
                bombLeft.classList.remove("softWall");
                bombLeft.classList.add("empty")
                grid[i][j-1] = 0;
            }
            if (bombTop.classList.contains("softWall")) {
                bombTop.classList.remove("softWall");
                bombTop.classList.add("empty")
                grid[i-1][j] = 0;
            }
            if (bombBottom.classList.contains("softWall")) {
                bombBottom.classList.remove("softWall");
                bombBottom.classList.add("empty")
                grid[i+1][j] = 0;
            }
            player.updateNeighborCells(grid)
            bomb.remove()
            if (player.cell.i == i && player.cell.j == j ||
                player.cell.i == i && player.cell.j == j+1 ||
                player.cell.i == i && player.cell.j == j-1 ||
                player.cell.i == i-1 && player.cell.j == j ||
                player.cell.i == i+1 && player.cell.j == j 
            ) {
                player.element.style.background = "red";
                setTimeout(() => {
                   // send to initial position

                   
                    player.element.style.background = "aqua";
                }, 1000)

            }
        },1000)
    }
})

// player.updateBounds(grid   )