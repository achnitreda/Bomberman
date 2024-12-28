import { player } from "./player.js"
import { gateCell } from "./map.js";

export const bomb = {
    element: null,
    exist: false,
    cell: {
        i: 0,
        j: 0
    },

    bounds: {
        right: null,
        left: null,
        bottom: null,
        top: null,
    },

    updateBounds: function () {
        this.bounds.right = [this.cell.i, this.cell.j + 1];
        this.bounds.left = [this.cell.i, this.cell.j - 1];
        this.bounds.bottom = [this.cell.i + 1, this.cell.j];
        this.bounds.top = [this.cell.i - 1, this.cell.j]
    },

    create: function () {
        this.cell.i = player.currentCell.i;
        this.cell.j = player.currentCell.j;
        this.updateBounds();


        const bombCell = document.getElementById(`cell${this.cell.i}#${this.cell.j}`);
        this.element = document.createElement("div");
        this.element.classList.add("bomb");

        bombCell.appendChild(this.element);
    },

    explosion: function (grid) {
        setTimeout(() => {
            for (let cellBounds in this.bounds) {
                const [i, j] = this.bounds[cellBounds];
                if (grid[i][j] == 1) {
                    const cell = document.getElementById(`cell${i}#${j}`);
                    cell.classList.remove("softWall");
                    cell.classList.add("empty");
                    grid[i][j] = 0;
                    if (i == gateCell[0] && j == gateCell[1]) {
                        cell.classList.add("gate")
                    }
                }
            }
            playerDeath(grid);
            this.element.remove();
            this.exist = false;
        }, 3000)
    },
}

function playerDeath(grid) {
    for (let cellBounds in bomb.bounds) {
        const [i, j] = bomb.bounds[cellBounds];
        if (player.currentCell.i == i && player.currentCell.j == j ||
            player.currentCell.i == bomb.cell.i && player.currentCell.j == bomb.cell.j
        ) {
            player.alive = false;
            player.element.style.background = "red";
            setTimeout(() => {
                // send to initial position
                player.alive = true;
                player.position.x -= player.position.x;
                player.position.y -= player.position.y;
                player.currentCell.i = 1;
                player.currentCell.j = 1;
                player.targetCell.i = 1;
                player.targetCell.j = 1;
                player.updateBounds(grid)

                player.element.style.transform = `translate(${-player.position.x}px, ${player.position.y}px)`;
                player.element.style.background = "aqua";
            }, 2000)
            break;
        }
    }
    if (player.alive) {
        player.updateBounds(grid)
    }
}