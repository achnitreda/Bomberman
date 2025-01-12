import { enemies } from "./map.js";

// let this.speed = 0;
let urgentMove = "";

const player = {
    element: document.getElementById("player"),
    alive: true,
    size: 0,
    speed: 0,
    revive: false,

    currentCell: {
        i: 1,
        j: 1
    },

    position: {
        x: 0,
        y: 0
    },

    bounds: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
    },

    passablility: {
        left: false,
        top: false,
        right: false,
        bottom: false,
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

    animation: function (currentTime, dir) {
        if (currentTime - this.sprite.lastUpdate > this.sprite.animationSpeed) {
            this.sprite.currentFrame = (this.sprite.currentFrame + 1) % this.sprite.frameCount;
            this.sprite.lastUpdate = currentTime;

            const x = this.sprite.currentFrame * this.sprite.framesize;
            const y = this.sprite.direction[dir.toLowerCase()];

            this.element.style.backgroundPosition = `-${x}px -${y}px`;
        }
    },

    deathAnimation: function (currentTime) {
        if (currentTime - this.deathSprite.lastUpdate > this.deathSprite.animationSpeed) {
            this.deathSprite.lastUpdate = currentTime;
            this.element.classList.toggle('opacity0');
        }
    },

    updateBounds: function (grid, cellsize) {
        this.bounds.left = Math.floor(this.position.x / cellsize) * cellsize;
        this.bounds.top = Math.floor(this.position.y / cellsize) * cellsize;
        this.bounds.right = Math.ceil(this.position.x / cellsize) * cellsize;
        this.bounds.bottom = Math.ceil(this.position.y / cellsize) * cellsize;

        this.updatepassability(grid, cellsize);
    },

    updatepassability: function (grid, cellsize) {
        const i = Math.floor(this.position.y / cellsize);
        const j = Math.floor(this.position.x / cellsize);

        this.passablility.left = grid[i][j - 1] == 0;
        this.passablility.right = grid[i][j + 1] == 0;
        this.passablility.top = grid[i - 1][j] == 0;
        this.passablility.bottom = grid[i + 1][j] == 0;
    },

    setPlayerProperties: function (cellsize) {
        this.speed = Math.ceil(4 * cellsize / 100)
        this.size = cellsize * 0.8
        const pxToCenter = Math.floor((cellsize - this.size) * 0.5);
        this.position.x = this.currentCell.j * cellsize + pxToCenter;
        this.position.y = this.currentCell.i * cellsize + pxToCenter;
        this.sprite.framesize = this.size;
        this.deathSprite.framesize = this.size;
        this.sprite.direction = {
            down: 0,
            left: this.size,
            up: this.size * 2,
            right: this.size * 3
        }

        this.element.style.backgroundSize = `${cellsize * 0.8 * 4}px ${cellsize * 0.8 * 4}px`
        this.element.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
    },

    move: function (direction, grid, cellSize) {
        const pxToCenter = Math.floor((cellSize - this.size) * 0.5);
        const centerY = (Math.floor((this.position.y + (this.size * 0.5)) / cellSize) * cellSize) + pxToCenter;
        const centerX = (Math.floor((this.position.x + (this.size * 0.5)) / cellSize) * cellSize) + pxToCenter;

        if (direction == "Right") {
            this.moveRight(centerX, centerY)
        } else if (direction == "Left") {
            this.moveLeft(centerX, centerY)
        } else if (direction == "Up") {
            this.moveUp(centerX, centerY)
        } else {
            this.moveDown(centerX, centerY)
        }

        if (((this.position.x + this.size <= (Math.ceil(this.position.x / cellSize)) * cellSize) && this.position.x >= (Math.floor(this.position.x / cellSize)) * cellSize) &&
            ((this.position.y + this.size <= (Math.ceil(this.position.y / cellSize)) * cellSize) && this.position.y >= (Math.floor(this.position.y / cellSize)) * cellSize)) {
            // console.log("x");

            this.updateBounds(grid, cellSize);
        }

        // player cell
        this.currentCell.j = Math.floor((this.position.x + (this.size * 0.5)) / cellSize);
        this.currentCell.i = Math.floor((this.position.y + (this.size * 0.5)) / cellSize);

        // move player
        this.element.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
    },

    moveRight: function (centerX, centerY) {
        if (centerY != this.position.y) {
            urgentMove = (centerY > this.position.y) ? "Down" : "Up";
            return
        }

        if ((this.position.x + (this.size)) + this.speed <= this.bounds.right) {
            this.position.x += this.speed;
        } else {
            if (this.passablility.right) {
                this.position.x += this.speed;
            }
        }

        if (urgentMove && this.position.x == centerX) urgentMove = "";
    },

    moveLeft: function (centerX, centerY) {

        if (centerY != this.position.y) {
            urgentMove = (centerY > this.position.y) ? "Down" : "Up";
            return
        }

        if (this.position.x - this.speed >= this.bounds.left) {
            this.position.x -= this.speed;
        } else {
            if (this.passablility.left) {
                this.position.x -= this.speed;
            }
        }

        if (urgentMove && this.position.x == centerX) urgentMove = "";
    },

    moveDown: function (centerX, centerY) {
        if (centerX != this.position.x) {
            urgentMove = (centerX > this.position.x) ? "Right" : "Left";
            return
        }

        if (this.position.y + this.size + this.speed <= this.bounds.bottom) {
            this.position.y += this.speed;
        } else {
            if (this.passablility.bottom) {
                this.position.y += this.speed;
            }
        }

        if (urgentMove && this.position.y == centerY) urgentMove = "";
    },

    moveUp: function (centerX, centerY) {
        if (centerX != this.position.x) {
            urgentMove = (centerX > this.position.x) ? "Right" : "Left";
            return
        }

        if (this.position.y - this.speed >= this.bounds.top) {
            this.position.y -= this.speed;
        } else {
            if (this.passablility.top) {
                this.position.y -= this.speed;
            }
        }

        if (urgentMove && this.position.y == centerY) urgentMove = "";
    },

    death: function (cellSize) {
        if (!this.alive) return;
        this.alive = false;
        this.element.classList.remove('opacity1')
        this.element.style.backgroundPosition = `0px 0px`;
        this.position.x = cellSize + Math.floor((cellSize - this.size) * 0.5);
        this.position.y = cellSize + Math.floor((cellSize - this.size) * 0.5);
        this.currentCell.i = 1;
        this.currentCell.j = 1;

        setTimeout(() => {
            this.revive = true;
            this.alive = true;
            
            this.element.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
            setTimeout(() => {
                this.element.classList.add('opacity1')
                this.revive = false;
            }, 2000)
        }, 2000)
    }
}

export { player, urgentMove };