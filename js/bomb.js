import { player } from "./player.js"
import { gateCell, enemies, stuckEnemies, enemiesIndexes, setScore } from "./map.js";
import { gameState } from "./main.js";

export const bomb = {
    element: null,
    explosionTimer: null,
    exist: false,

    cell: null,

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

            const x = this.sprite.currentFrame * this.sprite.frameSize;
            this.element.style.backgroundPosition = `-${x}px 0px`;
        }
    },

    updateCellsAffected: function () {
        this.cellsAffected.center = [this.cell.i, this.cell.j];
        this.cellsAffected.right = [this.cell.i, this.cell.j + 1];
        this.cellsAffected.left = [this.cell.i, this.cell.j - 1];
        this.cellsAffected.bottom = [this.cell.i + 1, this.cell.j];
        this.cellsAffected.top = [this.cell.i - 1, this.cell.j];
    },

    create: function (cellSize) {
        this.sprite.frameSize = cellSize * 0.8;
        const pxToCenter = (cellSize - this.sprite.frameSize) * 0.5;
        this.cell = { i: player.currentCell.i, j: player.currentCell.j };
        this.updateCellsAffected();

        const bombCell = document.getElementById(`cell${this.cell.i}#${this.cell.j}`);
        this.element = document.createElement("div");
        this.element.classList.add("bomb");
        this.element.style.transform = `translate(${pxToCenter}px, ${pxToCenter}px`;

        bombCell.appendChild(this.element);
    },

    explosion: function (grid, cellSize) {
        const applyExplosionEffect = (i, j) => {
            const cell = document.getElementById(`cell${i}#${j}`);
            const explosion = document.createElement('div');
            explosion.classList.add('explosion-effect');
            cell.appendChild(explosion);
        };

        if (this.explosionTimer) {
            clearTimeout(this.explosionTimer);
        }

        this.explosionStartTime = Date.now();

        this.explosionTimer = setTimeout(() => {
            if (!gameState.isPaused) {
                for (let cell in this.cellsAffected) {
                    const [i, j] = this.cellsAffected[cell];

                    if (grid[i][j] == 1 || grid[i][j] === 0) {
                        applyExplosionEffect(i, j);
                        const cell = document.getElementById(`cell${i}#${j}`);

                        // gate cell
                        cell.classList = (i == gateCell[0] && j == gateCell[1]) ? "cell gate" : "cell empty";
                        grid[i][j] = 0;
                    }

                    //player
                    if ((player.currentCell.i == i && player.currentCell.j == j)) {
                        player.death(cellSize);
                    }

                    // enimies 
                    let enemiesDied = 0;
                    enemies.forEach((enemy, index) => {
                        if (enemy.cell.i == i && enemy.cell.j == j) {
                            enemies.splice(index, 1);
                            enemiesIndexes.splice(index, 1);
                            enemy.element.remove();
                            player.score == 15;
                            enemiesDied++;
                        }
                    })

                    if (enemiesDied >= 2) {
                        player.score += enemiesDied * 2 * 15;
                        setScore(player.score);
                    } else if (enemiesDied == 1) {
                        player.score += 15;
                        setScore(player.score);
                    }

                    // stuck enemies 
                    stuckEnemies.forEach(enemy => {
                        enemy.updateBounds(grid)
                    })

                }

                this.cell = null;
                this.element.style.opacity = '0';
                this.exist = false;
            }
        }, 1500)
    },

    handlePause: function () {
        if (this.explosionTimer) {
            clearTimeout(this.explosionTimer);
            const elapsed = Date.now() - this.explosionStartTime;
            const remaining = Math.max(1500 - elapsed, 0);
            this.remainingExplosionTime = remaining;
        }
    },

    handleResume: function (grid, cellSize) {
        this.explosionTimer = setTimeout(() => {
            this.explosion(grid, cellSize);
        }, this.remainingExplosionTime);
        this.remainingExplosionTime = null;
    }
}