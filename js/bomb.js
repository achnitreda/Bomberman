import { player } from "./player.js"
import { gateCell, enimies } from "./map.js";
import { cellSize } from "./main.js";

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
        frameSize: 0,
        frameCount: 5,
        currentFrame: 0,
        lastUpdate: 0,
        animationSpeed: 100,
    },

    animate: function (currentTime) {
        if (currentTime - this.sprite.lastUpdate > this.sprite.animationSpeed) {
            this.sprite.currentFrame = (this.sprite.currentFrame + 1) % this.sprite.frameCount;
            this.sprite.lastUpdate = currentTime;

            const x = this.sprite.currentFrame * this.sprite.frameSize;
            this.element.style.backgroundPosition = `-${x}px 0px`;
        }
    },

    updateNeighbors: function () {
        this.neighbors.right = [this.cell.i, this.cell.j + 1];
        this.neighbors.left = [this.cell.i, this.cell.j - 1];
        this.neighbors.bottom = [this.cell.i + 1, this.cell.j];
        this.neighbors.top = [this.cell.i - 1, this.cell.j];
    },

    create: function (cellSize) {
        this.sprite.frameSize = cellSize*0.8;
        const pxToCenter = ((cellSize - this.sprite.frameSize) *0.5);
        this.cell = { i: player.currentCell.i, j: player.currentCell.j };
        this.updateNeighbors();

        const bombCell = document.getElementById(`cell${this.cell.i}#${this.cell.j}`);
        this.element = document.createElement("div");
        this.element.classList.add("bomb");
        this.element.style.transform = `translate(${pxToCenter}px, ${pxToCenter}px`;

        bombCell.appendChild(this.element);
    },

    explosion: function (grid) {
        setTimeout(() => {
            for (let neighbor in this.neighbors) {
                const [i, j] = this.neighbors[neighbor];
                // const emptycells = []
                // breackable walls 
                /*if (grid[i][j] == 0) {
                    emptycells.push(document.getElementById(`cell${i}#${j}`))
                }else */if (grid[i][j] == 1) {
                    const cell = document.getElementById(`cell${i}#${j}`);
                    cell.classList = (i == gateCell[0] && j == gateCell[1]) ? "cell gate" : "cell empty";
                    grid[i][j] = 0;
                }

                //player
                if ((player.currentCell.i == i && player.currentCell.j == j) || (player.currentCell.i == bomb.cell.i && player.currentCell.j == bomb.cell.j)) {
                    player.death(cellSize);
                }

                // enimies 
                // enimies.forEach((enimy, index) => {
                //     if (enimy.cell.i == i && enimy.cell.j == j) {
                //         enimies.splice(index, 1);
                //         enimy.element.remove();
                //     }
                // })
            }


            bomb.cell = null;
            this.element.remove();
            this.exist = false;
        }, 1500)
    },
}

