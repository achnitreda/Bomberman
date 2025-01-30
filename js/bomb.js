import { player } from "./player.js"
import { gateCell, enemies, setScore } from "./map.js";
import { gameState } from "./main.js";

export const bomb = {
    element: null,
    exist: false,
    cell: null,
    createTime: null,
    explode: false,
    timerId: null,

    cellsAffected: {
        center: null,
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

    updateSize: function (cellSize) {
        this.sprite.frameSize = cellSize * 0.8;
        if (this.element) {
            const pxToCenter = Math.floor((cellSize - this.sprite.frameSize) / 2);
            this.element.style.transform = `translate(${pxToCenter}px, ${pxToCenter}px)`;

            const x = this.sprite.currentFrame * this.sprite.frameSize;
            this.element.style.backgroundPosition = `-${x}px 0px`;
        }
    },

    animate: function (currentTime) {
        if (currentTime - this.sprite.lastUpdate > this.sprite.animationSpeed) {
            this.sprite.currentFrame = (this.sprite.currentFrame + 1) % this.sprite.frameCount;
            this.sprite.lastUpdate = currentTime;
            this.element.style.backgroundPosition = `-${this.sprite.currentFrame * this.sprite.frameSize}px 0px`;
        }
    },

    setCellsAffected: function () {
        this.cellsAffected.center = [this.cell.i, this.cell.j];
        this.cellsAffected.right = [this.cell.i, this.cell.j + 1];
        this.cellsAffected.left = [this.cell.i, this.cell.j - 1];
        this.cellsAffected.bottom = [this.cell.i + 1, this.cell.j];
        this.cellsAffected.top = [this.cell.i - 1, this.cell.j];
    },

    create: function (time) {
        this.sprite.frameSize = gameState.cellSize * 0.8;
        this.cell = {
            i: Math.trunc((player.position.y + (player.size * 0.5)) / gameState.cellSize),
            j: Math.trunc((player.position.x + (player.size * 0.5)) / gameState.cellSize)
        }
        this.setCellsAffected();
        const bombCell = document.getElementById(`cell${this.cell.i}#${this.cell.j}`);
        this.element = document.createElement("div");
        this.element.classList.add("bomb");
        this.element.style.transform = `translate(${(gameState.cellSize - this.sprite.frameSize) * 0.5}px, ${(gameState.cellSize - this.sprite.frameSize) * 0.5}px`;
        bombCell.appendChild(this.element);
        this.createTime = time;
    },

    applyExplosionEffect: (i, j) => {
        const cell = document.getElementById(`cell${i}#${j}`);
        const explosion = document.createElement('div');
        explosion.classList.add('explosion-effect');
        cell.appendChild(explosion);
    },

    explosion: function (grid, cellSize) {
        for (let cell in this.cellsAffected) {
            const [i, j] = this.cellsAffected[cell];
            if (grid[i][j] == 1 || grid[i][j] == 0) {
                this.applyExplosionEffect(i, j);
                const cell = document.getElementById(`cell${i}#${j}`);
                // gate cell
                if (i == gateCell[0] && j == gateCell[1]) {
                    cell.classList = "cell gate";
                    cell.style.backgroundImage = 'none';
                } else {
                    cell.classList = "cell empty";
                    cell.style.backgroundPosition = `${-cellSize}px ${-(gameState.level) * cellSize}px`;
                }
                grid[i][j] = 0;
            }
            
            //player
            if (Math.trunc((player.position.y + (player.size * 0.5)) / cellSize) == i && Math.trunc((player.position.x + (player.size * 0.5)) / cellSize) == j) {
                player.death(cellSize);
            }

            // enimies 
            enemies.forEach((enemy, index) => {
                if (Math.trunc((enemy.position.y + (enemy.size * 0.5))/cellSize) == i && Math.trunc((enemy.position.x + (enemy.size * 0.5))/cellSize) == j) {
                    enemies.splice(index, 1);
                    enemy.element.remove();
                    gameState.score += 15;
                    setScore(gameState.score);
                }
            })

        }
        this.element.remove();
        this.createTime = null;
        this.cell = null;
    },
}