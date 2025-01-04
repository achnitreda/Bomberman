import { player } from "./player.js"
import { gateCell, mapCells } from "./map.js";

export const bomb = {
    element: null,
    exist: false,
    cell: null,

    neighbors: {
        right: null,
        left: null,
        bottom: null,
        top: null,
    },

    sprite: {
        width: 28,
        frameCount: 5,
        currentFrame: 0,
        lastUpdate: 0,
        animationSpeed: 100,
    },

    animate: function (currentTime) {
        if (currentTime - this.sprite.lastUpdate > this.sprite.animationSpeed) {
            this.sprite.currentFrame = (this.sprite.currentFrame + 1) % this.sprite.frameCount;
            this.sprite.lastUpdate = currentTime;

            const x = this.sprite.currentFrame * this.sprite.width;
            this.element.style.backgroundPosition = `-${x}px 0px`;
        }
    },

    updateNeighbors: function () {
        this.neighbors.right = [this.cell.i, this.cell.j + 1];
        this.neighbors.left = [this.cell.i, this.cell.j - 1];
        this.neighbors.bottom = [this.cell.i + 1, this.cell.j];
        this.neighbors.top = [this.cell.i - 1, this.cell.j]
    },

    create: function () {
        this.cell = {i: player.currentCell.i, j: player.currentCell.j}
        this.updateNeighbors();


        const bombCell = mapCells[`cell${this.cell.i}#${this.cell.j}`];
        this.element = document.createElement("div");
        this.element.classList.add("bomb");

        bombCell.appendChild(this.element);
    },

    explosion: function (grid) {
        setTimeout(() => {
            for (let neighbor in this.neighbors) {
                const [i, j] = this.neighbors[neighbor];
                if (grid[i][j] == 1) {
                    const cell = mapCells[`cell${i}#${j}`];
                    cell.classList = (i == gateCell[0] && j == gateCell[1]) ? "cell gate" : "cell empty";
                    grid[i][j] = 0;
                }
            }

            playerDeath(grid);
            bomb.cell = null;
            this.element.remove();
            this.exist = false;
        }, 1300)
    },
}

function playerDeath(grid) {
    for (let cellBounds in bomb.neighbors) {
        const [i, j] = bomb.neighbors[cellBounds];
        if (player.currentCell.i == i && player.currentCell.j == j ||
            player.currentCell.i == bomb.cell.i && player.currentCell.j == bomb.cell.j
        ) {
            player.alive = false;
            player.position.x = 47;
            player.position.y = 46;
            player.currentCell.i = 1;
            player.currentCell.j = 1;
            setTimeout(() => {
                player.alive = true;
                player.element.style.transform = `translate(${player.position.x}px, ${player.position.y}px)`;
            }, 1000)
            break;
        }
    }
}