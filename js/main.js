import { mapVisual } from "./map.js";
import { player, animation } from "./player.js";
const board = document.getElementById('board')




const grid = mapVisual(board, player);

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "ArrowDown") {
        if (!animation.id) {
            animation.id = requestAnimationFrame(() => player.move(e.key.slice(5), grid))
        }
    }
});

document.addEventListener("keyup", () => {
    cancelAnimationFrame(animation.id);
    animation.id = null;
})

document.addEventListener("keypress", e => {
    if (e.key.toLowerCase() == 'z') {
        const bombCell = document.getElementById(`cell${player.cell.i}${player.cell.j}`);
        const bomb = document.createElement("div");
        const i = player.cell.i;
        const j = player.cell.j;

        bomb.classList.add("bomb");
        bombCell.appendChild(bomb);
        setTimeout(()=> {
            const bombRight = document.getElementById(`cell${i}${j+1}`);
            const bombLeft = document.getElementById(`cell${i}${j-1}`);
            const bombTop = document.getElementById(`cell${i-1}${j}`);
            const bombBottom = document.getElementById(`cell${i+1}${j}`);
            console.log(bombRight);
            

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

            bomb.remove()
        },3000)
    }
})