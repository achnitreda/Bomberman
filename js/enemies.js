import { bomb } from "./bomb.js";
import { gameState } from "./main.js";
import { player } from "./player.js";


export class Enemy {
    constructor() {
        this.element = null;
        this.speed = 0;
        this.size = 0;
        this.pxTocenter = 0;
        this.initCell = { i: 0, j: 0 };
        this.switchCell = { i: 0, j: 0 }
        this.position = { x: 0, y: 0 };
        this.positionInCell = { x: 0, y: 0 };
        this.axis = null;
        this.direction = 1;

        this.sprite = {
            frameCount: 5,
            currentFrame: 0,
            lastUpdate: 0,
            animationSpeed: 180,
        }
    }

    setEnemyProperties() {
        this.speed = gameState.cellSize / 40;
        this.size = Math.trunc(gameState.cellSize * 0.8);
        this.pxTocenter = Math.trunc((gameState.cellSize - this.size) * 0.5) + 1;
        this.position.x = (gameState.cellSize * this.initCell.j) + this.pxTocenter;
        this.position.y = (gameState.cellSize * this.initCell.i) + this.pxTocenter;
        this.element.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
    }

    create(i, j) {
        this.element = document.createElement('div');
        this.element.classList.add('enemy');
        this.initCell.i = i;
        this.initCell.j = j;
        this.axis = (Math.random() > 0.5 ? 'hor' : 'ver');
        this.setEnemyProperties();
        gameState.board.appendChild(this.element);
    }

    switchAxis(grid) {
        this.i = Math.trunc((this.position.y + (this.size * 0.5)) / gameState.cellSize);
        this.j = Math.trunc((this.position.x + (this.size * 0.5)) / gameState.cellSize);

        if (this.axis == 'hor') {
            if (this.direction == 1 && (grid[this.i + 1][this.j] == 0 || grid[this.i - 1][this.j] == 0)) {
                if ((this.position.x >= this.j * gameState.cellSize + this.pxTocenter && this.j != this.switchCell.j)) {
                    if (Math.random() > 0.4) this.axis = 'ver';
                    this.switchCell.i = this.i;
                    this.switchCell.j = this.j;
                }
            } else if (this.direction == -1 && (grid[this.i + 1][this.j] == 0 || grid[this.i - 1][this.j] == 0)) {
                if (this.position.x <= this.j * gameState.cellSize + this.pxTocenter && this.j != this.switchCell.j) {
                    if (Math.random() > 0.4) this.axis = 'ver';
                    this.switchCell.i = this.i;
                    this.switchCell.j = this.j;
                }
            }
        } else {
            if (this.direction == 1 && (grid[this.i][this.j+1] == 0 || grid[this.i][this.j-1] == 0)) {
                if ((this.position.y >= this.i * gameState.cellSize + this.pxTocenter && this.i != this.switchCell.i)) {
                    if (Math.random() > 0.4) this.axis = 'hor';
                    this.switchCell.i = this.i;
                    this.switchCell.j = this.j;
                }
            } else if (this.direction == -1 && (grid[this.i][this.j+1] == 0 || grid[this.i][this.j-1] == 0)) {
                if (this.position.y <= this.i * gameState.cellSize + this.pxTocenter && this.i != this.switchCell.i) {
                    if (Math.random() > 0.4) this.axis = 'hor';
                    this.switchCell.i = this.i;
                    this.switchCell.j = this.j;
                }
            }
        }

    }

    move(grid, time) {
        if (this.axis == 'hor') {
            if (this.direction == 1) this.moveRight(grid);
            else this.moveLeft(grid);
        } else {
            if (this.direction == 1) this.moveDown(grid);
            else this.moveUp(grid);
        }

        this.element.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
        this.switchAxis(grid);

        if (this.collisionWithplayer()) {
            player.death(gameState.cellSize, time);
        }

    }

    moveRight(grid) {
        this.i = Math.trunc((this.position.y) / gameState.cellSize);
        this.j = Math.trunc((this.position.x + this.size) / gameState.cellSize);
        this.bombCell = (bomb.exist) && (bomb.cell.i == this.i && bomb.cell.j == this.j);
        
        if (grid[this.i][this.j] == 0 && !this.bombCell) {
            this.position.x += this.speed;
        } else {
            this.direction = -1;
            this.switchCell.i = this.i;
            this.switchCell.j = this.j-1;
        }
    }

    moveLeft(grid) {
        this.i = Math.trunc((this.position.y) / gameState.cellSize);
        this.j = Math.trunc((this.position.x) / gameState.cellSize);
        this.bombCell = (bomb.exist) && (bomb.cell.i == this.i && bomb.cell.j == this.j);

        if (grid[this.i][this.j] == 0 && !this.bombCell) {
            this.position.x -= this.speed;
        } else {
            this.direction = 1;
            this.switchCell.i = this.i;
            this.switchCell.j = this.j+1;
        }
    }

    moveUp(grid) {
        this.i = Math.trunc((this.position.y) / gameState.cellSize);
        this.j = Math.trunc((this.position.x) / gameState.cellSize);
        this.bombCell = (bomb.exist) && (bomb.cell.i == this.i && bomb.cell.j == this.j);

        if (grid[this.i][this.j] == 0 && !this.bombCell) {
            this.position.y -= this.speed;
        } else {
            this.direction = 1;
            this.switchCell.i = this.i+1;
            this.switchCell.j = this.j;
        }
    }

    moveDown(grid) {
        this.i = Math.trunc((this.position.y + this.size) / gameState.cellSize);
        this.j = Math.trunc((this.position.x) / gameState.cellSize);
        this.bombCell = (bomb.exist) && (bomb.cell.i == this.i && bomb.cell.j == this.j);

        if (grid[this.i][this.j] == 0 && !this.bombCell) {
            this.position.y += this.speed;
        } else {
            this.direction = -1;
            this.switchCell.i = this.i-1;
            this.switchCell.j = this.j;
        }
    }

    animate(currentTime) {
        if (currentTime - this.sprite.lastUpdate > this.sprite.animationSpeed) {
            this.sprite.currentFrame = (this.sprite.currentFrame + 1) % this.sprite.frameCount;
            this.sprite.lastUpdate = currentTime;
            this.element.style.backgroundPosition = `-${this.sprite.currentFrame * (gameState.cellSize * 0.8)}px 0px`;
        }
    }

    collisionWithplayer() {
        return Math.trunc((player.position.y + (player.size * 0.5))/gameState.cellSize) == Math.trunc((this.position.y + (this.size * 0.5))/gameState.cellSize) &&
        Math.trunc((player.position.x + (player.size * 0.5))/gameState.cellSize) == Math.trunc((this.position.x + (this.size * 0.5))/gameState.cellSize);
    }
}