import { bomb } from "./bomb.js";
import { gameState } from "./main.js";
import { player } from "./player.js";
export const enimiesNumber = 1;
const speed = 1;
// const horz = 1, vert = -1;

export class Enemy {
    constructor() {
        this.element = null;
        this.cell = { i: 0, j: 0 };
        this.size = 0;
        this.position = { x: 0, y: 0 };
        this.positionInCell = { x: 0, y: 0 };
        this.axis = null;
        this.moveEntries = {
            hor: ['x', 'left', 'right'],
            ver: ['y', 'top', 'bottom'],
            direction: 1
        };

        this.bounds = {
            right: 0,
            left: 0,
            top: 0,
            bottom: 0
        }
        this.passability = {
            right: false,
            left: false,
            top: false,
            bottom: false
        }
        this.sprite = {
            frameCount: 5,
            currentFrame: 0,
            lastUpdate: 0,
            animationSpeed: 180,
        }
    }

    updateSize(cellSize) {
        this.size = cellSize * 0.8
        const pxToCenter = Math.floor((cellSize - this.size) / 2);

        this.positionInCell.x = pxToCenter
        this.positionInCell.y = pxToCenter

        this.element.style.transform = `translate(${this.positionInCell.x}px, ${this.positionInCell.y}px)`;
    }

    updateBounds(grid) {
        const cellSize = gameState.cellSize
        const posX = ((this.position.x + (this.size * 0.55)) / cellSize);
        const posY = ((this.position.y + (this.size * 0.55)) / cellSize);


        this.bounds.left = Math.floor(posX) * cellSize;
        this.bounds.top = Math.floor(posY) * cellSize;
        this.bounds.right = Math.ceil(posX) * cellSize;
        this.bounds.bottom = Math.ceil(posY) * cellSize;

        console.log("----updateBounds-----")
        console.log(cellSize)
        console.log(this.position.x)
        console.log(this.position.y)
        console.log(this.bounds)

        this.updatPassability(grid)
    }

    updatPassability(grid) {
        const cellSize = gameState.cellSize
        const i = Math.floor((this.position.y + (this.size * 0.55)) / cellSize);
        const j = Math.floor((this.position.x + (this.size * 0.55)) / cellSize);

        this.passability.right = grid[i][j + 1] == 0;
        this.passability.left = grid[i][j - 1] == 0;
        this.passability.bottom = grid[i + 1][j] == 0;
        this.passability.top = grid[i - 1][j] == 0;

        this.cell.i = i;
        this.cell.j = j;
    }

    create(i, j, grid) {
        const cellSize = gameState.cellSize
        const enimieCell = document.getElementById(`cell${i}#${j}`);
        this.size = cellSize * 0.8;
        const pxToCenter = Math.floor((cellSize - this.size) / 2);
        this.element = document.createElement('div');
        this.element.classList.add('enemy');
        this.element.style.transform = `translate(${pxToCenter}px, ${pxToCenter}px)`;
        this.cell.i = i;
        this.cell.j = j;
        this.position.x = cellSize * j + pxToCenter;
        this.position.y = cellSize * i + pxToCenter;
        this.positionInCell.x = pxToCenter;
        this.positionInCell.y = pxToCenter;



        this.axis = (Math.random() > 0.5 ? 'hor' : 'ver');
        this.updateBounds(grid);
        enimieCell.appendChild(this.element);

        console.log("-------Debug-----")
        console.log("cellSize =>", cellSize)
        console.log("this.size =>", this.size)
        console.log("pxToCenter =>", pxToCenter)
        console.log("this.cell.i =>", this.cell.i)
        console.log("this.cell.j =>", this.cell.j)
        console.log("this.position.x =>", this.position.x)
        console.log("this.position.y =>", this.position.y)
        console.log("this.positionInCell.x =>", this.positionInCell.x)
        console.log("this.positionInCell.y =>", this.positionInCell.y)

    }

    move(grid) {
        // console.log(this.position[this.moveEntries[this.axis][0]]);
        const cellSize = gameState.cellSize
        if (this.moveEntries.direction == 1) {
            if (this.position[this.moveEntries[this.axis][0]] + this.size + speed <= this.bounds[this.moveEntries[this.axis][2]]) {
                this.position[this.moveEntries[this.axis][0]] += speed;
                this.positionInCell[this.moveEntries[this.axis][0]] += speed;
            } else {
                if (this.passability[this.moveEntries[this.axis][2]]) {
                    this.position[this.moveEntries[this.axis][0]] += speed;
                    this.positionInCell[this.moveEntries[this.axis][0]] += speed;
                    if (this.axis == 'hor') {
                        if (bomb.cell && (this.cell.j + 1 == bomb.cell.j && this.cell.i == bomb.cell.i)) {
                            this.moveEntries.direction = -1
                        }
                    } else {
                        if (bomb.cell && (this.cell.j == bomb.cell.j && this.cell.i + 1 == bomb.cell.i)) {
                            this.moveEntries.direction = -1
                        }
                    }
                } else {
                    this.moveEntries.direction = -1;
                }
            }

            if (this.position[this.moveEntries[this.axis][0]] + (this.size * 0.55) > this.bounds[this.moveEntries[this.axis][2]]) {
                this.updateBounds(grid);
            }
        } else {
            if (this.position[this.moveEntries[this.axis][0]] - speed >= this.bounds[this.moveEntries[this.axis][1]]) {
                this.position[this.moveEntries[this.axis][0]] -= speed;
                this.positionInCell[this.moveEntries[this.axis][0]] -= speed;



            } else {
                if (this.passability[this.moveEntries[this.axis][1]]) {
                    this.position[this.moveEntries[this.axis][0]] -= speed;
                    this.positionInCell[this.moveEntries[this.axis][0]] -= speed;
                    if (this.axis == 'hor') {
                        if (bomb.cell && (this.cell.j - 1 == bomb.cell.j && this.cell.i == bomb.cell.i)) {
                            this.moveEntries.direction = 1
                        }
                    } else {
                        if (bomb.cell && (this.cell.j == bomb.cell.j && this.cell.i - 1 == bomb.cell.i)) {
                            this.moveEntries.direction = 1
                        }
                    }
                } else {
                    this.moveEntries.direction = 1;
                }
            }

            if (this.position[this.moveEntries[this.axis][0]] + (this.size * 0.55) < this.bounds[this.moveEntries[this.axis][1]]) {
                this.updateBounds(grid);

            }
        }

        this.element.style.transform = `translate(${this.positionInCell.x}px, ${this.positionInCell.y}px)`
        if (this.collisionWithplayer()) {
            player.death(cellSize);
        }

    }

    animate(currentTime) {
        const cellSize = gameState.cellSize
        if (currentTime - this.sprite.lastUpdate > this.sprite.animationSpeed) {
            this.sprite.currentFrame = (this.sprite.currentFrame + 1) % this.sprite.frameCount;
            this.sprite.lastUpdate = currentTime;

            const x = this.sprite.currentFrame * (cellSize * 0.8);
            this.element.style.backgroundPosition = `-${x}px 0px`;
        }
    }

    collisionWithplayer() {
        const enemyRect = this.element.getBoundingClientRect();
        const playerRect = player.element.getBoundingClientRect();

        return !(enemyRect.right < playerRect.left ||
            enemyRect.left > playerRect.right ||
            enemyRect.bottom < playerRect.top ||
            enemyRect.top > playerRect.bottom);
    }

}