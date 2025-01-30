import { gameState } from "./main.js";
import { setNbOfHearts } from "./map.js";

const player = {
    element: document.getElementById("player"),
    alive: true,
    revive: false,
    size: 0,
    speed: 0,
    lifes: 3,

    position: {
        x: 0,
        y: 0
    },

    sprite: {
        framesize: 0,
        currentFrame: 0,
        frameCount: 4,
        lastUpdate: 0,
        animationSpeed: 80,
        direction: {}
    },

    deathSprite: {
        lastUpdate: 0,
        animationSpeed: 80,
    },

    setPlayerProperties: function (cellsize, i, j) {
        this.speed = cellsize / 20;
        this.size = Math.trunc(cellsize * 0.8);
        this.position.x = (j * cellsize) + Math.trunc((cellsize - this.size) * 0.5);
        this.position.y = (i * cellsize) + Math.trunc((cellsize - this.size) * 0.5);
        this.sprite.framesize = this.size;

        this.sprite.direction = {
            down: 0,
            left: this.size,
            up: this.size * 2,
            right: this.size * 3
        }

        this.element.style.backgroundSize = `${this.size * 4}px ${this.size * 4}px`
        this.element.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;

        // update animation move during resize
        this.element.style.backgroundPosition = `0px 0px`;
    },

    move: function (direction, grid) {
        const centerY = (Math.floor((this.position.y + (this.size * 0.5)) / gameState.cellSize) * gameState.cellSize) + (gameState.cellSize - this.size) * 0.5;
        const centerX = (Math.floor((this.position.x + (this.size * 0.5)) / gameState.cellSize) * gameState.cellSize) + (gameState.cellSize - this.size) * 0.5;

        switch (direction) {
            case "Right": this.moveRight(centerY, grid); break;
            case "Left": this.moveLeft(centerY, grid); break;
            case "Up": this.moveUp(centerX, grid); break;
            case "Down": this.moveDown(centerX, grid); break;
        }
        this.element.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
    },

    moveRight: function (centerY, grid) {
        const verticalOffset = Math.abs(centerY - this.position.y);
        const i = Math.floor((this.position.y) / gameState.cellSize);
        const j = Math.floor((this.position.x + this.size) / gameState.cellSize);
        
        if (verticalOffset > this.speed) {
            this.position.y += centerY > this.position.y ? this.speed : -this.speed;
        } else if (grid[i][j] == 0) {
            this.position.x += this.speed;
        }
    },

    moveLeft: function (centerY, grid) {
        const verticalOffset = Math.abs(centerY - this.position.y);
        const i = Math.floor((this.position.y) / gameState.cellSize);
        const j = Math.floor((this.position.x) / gameState.cellSize);

        if (verticalOffset > this.speed) {
            this.position.y += centerY > this.position.y ? this.speed : -this.speed;
        } else if (grid[i][j] == 0) {
            this.position.x -= this.speed;
        }
    },

    moveDown: function (centerX, grid) {
        const horizontalOffset = Math.abs(centerX - this.position.x);
        const i = Math.floor((this.position.y + this.size) / gameState.cellSize);
        const j = Math.floor((this.position.x) / gameState.cellSize);
        
        if (horizontalOffset > this.speed) {
            this.position.x += centerX > this.position.x ? this.speed : -this.speed;
        } else if (grid[i][j] == 0) {
            this.position.y += this.speed;
        }
    },

    moveUp: function (centerX, grid) {
        const horizontalOffset = Math.abs(centerX - this.position.x);
        const i = Math.floor((this.position.y) / gameState.cellSize);
        const j = Math.floor((this.position.x) / gameState.cellSize);
        
        if (horizontalOffset > this.speed) {
            this.position.x += centerX > this.position.x ? this.speed : -this.speed;
        } else if (grid[i][j] == 0) {
            this.position.y -= this.speed;
        }
    },

    animation: function (currentTime, dir) {
        if (currentTime - this.sprite.lastUpdate > this.sprite.animationSpeed) {
            this.sprite.currentFrame = (this.sprite.currentFrame + 1) % this.sprite.frameCount;
            this.sprite.lastUpdate = currentTime;
            this.element.style.backgroundPosition = `-${this.sprite.currentFrame * this.sprite.framesize}px -${this.sprite.direction[dir.toLowerCase()]}px`;
        }
    },

    deathAnimation: function (currentTime) {
        if (currentTime - this.deathSprite.lastUpdate > this.deathSprite.animationSpeed) {
            this.deathSprite.lastUpdate = currentTime;
            this.element.classList.toggle('opacity0');
        }
    },

    death: function (cellSize) {
        if (!this.alive && !this.revive) return;

        this.lifes--;
        this.alive = false;
        this.element.classList.remove('opacity1');
        this.element.style.backgroundPosition = `0px 0px`;
        this.position.x = cellSize + Math.floor((cellSize - this.size) * 0.5);
        this.position.y = cellSize + Math.floor((cellSize - this.size) * 0.5);
        setNbOfHearts(this.lifes);
        
        // add logic to work with RAF time rather than settimeout
        setTimeout(() => {
            this.revive = true;
            this.alive = true;
            this.element.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;

            setTimeout(() => {
                this.element.classList.add('opacity1');
                this.revive = false;
            }, 2000)

        }, 2000)
    }
}

export { player };