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
        this.positionInCell.x = this.pxTocenter;
        this.positionInCell.y = this.pxTocenter;
        this.element.style.transform = `translate(${this.positionInCell.x}px, ${this.positionInCell.y}px)`;
    }

    create(i, j) {
        const enimieCell = document.getElementById(`cell${i}#${j}`);
        this.element = document.createElement('div');
        this.element.classList.add('enemy');
        this.initCell.i = i;
        this.initCell.j = j;
        this.axis = (Math.random() > 0.5 ? 'hor' : 'ver');
        this.setEnemyProperties();
        enimieCell.appendChild(this.element);
    }

    switchAxis(grid) {
        const i = Math.trunc((this.position.y + (this.size * 0.5)) / gameState.cellSize);
        const j = Math.trunc((this.position.x + (this.size * 0.5)) / gameState.cellSize);

        if (this.axis == 'hor') {
            if (this.direction == 1 && (grid[i + 1][j] == 0 || grid[i - 1][j] == 0)) {
                if ((this.position.x >= j * gameState.cellSize + this.pxTocenter && j != this.switchCell.j)) {
                    if (Math.random() > 0.5) this.axis = 'ver';
                    if (Math.random() > 0.5) this.direction = -1;
                    
                    this.switchCell.i = i;
                    this.switchCell.j = j;
                }
            } else if (this.direction == -1 && (grid[i + 1][j] == 0 || grid[i - 1][j] == 0)) {
                if (this.position.x <= j * gameState.cellSize + this.pxTocenter && j != this.switchCell.j) {
                    if (Math.random() > 0.5) this.axis = 'ver';
                    if (Math.random() > 0.5) this.direction = 1;
                    this.switchCell.i = i;
                    this.switchCell.j = j;
                }
            }
        } else {
            if (this.direction == 1 && (grid[i][j+1] == 0 || grid[i][j-1] == 0)) {
                if ((this.position.y >= i * gameState.cellSize + this.pxTocenter && i != this.switchCell.i)) {
                    if (Math.random() > 0.5) this.axis = 'hor';
                    if (Math.random() > 0.5) this.direction = -1;
                    this.switchCell.i = i;
                    this.switchCell.j = j;
                }
            } else if (this.direction == -1 && (grid[i][j+1] == 0 || grid[i][j-1] == 0)) {
                if (this.position.y <= i * gameState.cellSize + this.pxTocenter && i != this.switchCell.i) {
                    if (Math.random() > 0.5) this.axis = 'hor';
                    if (Math.random() > 0.5) this.direction = 1;
                    this.switchCell.i = i;
                    this.switchCell.j = j;
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

        this.element.style.transform = `translate(${this.positionInCell.x}px, ${this.positionInCell.y}px)`;
        this.switchAxis(grid);

        if (this.collisionWithplayer()) {
            player.death(gameState.cellSize, time);
        }

    }

    moveRight(grid) {
        const i = Math.trunc((this.position.y) / gameState.cellSize);
        const j = Math.trunc((this.position.x + this.size) / gameState.cellSize);
        const bombCell = (bomb.exist) && (bomb.cell.i == i && bomb.cell.j == j);
        
        if (grid[i][j] == 0 && !bombCell) {
            this.position.x += this.speed;
            this.positionInCell.x += this.speed;
        } else {
            this.direction = -1;
            this.switchCell.i = i;
            this.switchCell.j = j-1;
        }
    }

    moveLeft(grid) {
        const i = Math.trunc((this.position.y) / gameState.cellSize);
        const j = Math.trunc((this.position.x) / gameState.cellSize);
        const bombCell = (bomb.exist) && (bomb.cell.i == i && bomb.cell.j == j);

        if (grid[i][j] == 0 && !bombCell) {
            this.position.x -= this.speed;
            this.positionInCell.x -= this.speed;
        } else {
            this.direction = 1;
            this.switchCell.i = i;
            this.switchCell.j = j+1;
        }
    }

    moveUp(grid) {
        const i = Math.trunc((this.position.y) / gameState.cellSize);
        const j = Math.trunc((this.position.x) / gameState.cellSize);
        const bombCell = (bomb.exist) && (bomb.cell.i == i && bomb.cell.j == j);

        if (grid[i][j] == 0 && !bombCell) {
            this.position.y -= this.speed;
            this.positionInCell.y -= this.speed;
        } else {
            this.direction = 1;
            this.switchCell.i = i+1;
            this.switchCell.j = j;
        }
    }

    moveDown(grid) {
        const i = Math.trunc((this.position.y + this.size) / gameState.cellSize);
        const j = Math.trunc((this.position.x) / gameState.cellSize);
        const bombCell = (bomb.exist) && (bomb.cell.i == i && bomb.cell.j == j);

        if (grid[i][j] == 0 && !bombCell) {
            this.position.y += this.speed;
            this.positionInCell.y += this.speed;
        } else {
            this.direction = -1;
            this.switchCell.i = i-1;
            this.switchCell.j = j;
        }
    }

    animate(currentTime) {
        const cellSize = gameState.cellSize
        if (currentTime - this.sprite.lastUpdate > this.sprite.animationSpeed) {
            this.sprite.currentFrame = (this.sprite.currentFrame + 1) % this.sprite.frameCount;
            this.sprite.lastUpdate = currentTime;
            this.element.style.backgroundPosition = `-${this.sprite.currentFrame * (cellSize * 0.8)}px 0px`;
        }
    }

    collisionWithplayer() {
        return Math.trunc((player.position.y + (player.size * 0.5))/gameState.cellSize) == Math.trunc((this.position.y + (this.size * 0.5))/gameState.cellSize) &&
        Math.trunc((player.position.x + (player.size * 0.5))/gameState.cellSize) == Math.trunc((this.position.x + (this.size * 0.5))/gameState.cellSize);
    }
}