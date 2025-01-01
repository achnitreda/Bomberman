import { mapCells } from "./map.js";
const SPEED = 2;


export let animation = {
    id: null
};

export const player = {
    element: document.getElementById("player"),
    alive: true,
    currentCell: {
        i: 1,
        j: 1
    },

    position: {
        x: 47,
        y: 42
    },

    bounds: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
    },

    boxes: {
        nb: 1,
        axis: null
    },

    passablility: {
        left: false,
        top: false,
        right: false,
        bottom: false,
    },

    sprite: {
        frameWidth: 26,
        frameHeight: 28,
        currentFrame: 0,
        frameCount: 4,
        lastUpdate: 0,
        animationSpeed: 95,
        direction: {
            down: 0,
            left: 28,
            up: 56,
            right: 84,
        }
    },


    animation: function (currentTime, dir) {
        if (currentTime - this.sprite.lastUpdate > this.sprite.animationSpeed) {
            this.sprite.currentFrame = (this.sprite.currentFrame + 1) % this.sprite.frameCount;
            this.sprite.lastUpdate = currentTime;

            const x = this.sprite.currentFrame * this.sprite.frameWidth;
            const y = this.sprite.direction[dir.toLowerCase()];
            this.element.style.backgroundPosition = `-${x}px -${y}px`;
        }
    },

    oneBoxBounds: function (grid) {
        this.bounds.left = Math.floor(this.position.x / 40) * 40;
        this.bounds.top = Math.floor(this.position.y / 40) * 40;
        this.bounds.right = Math.ceil(this.position.x / 40) * 40;
        this.bounds.bottom = Math.ceil(this.position.y / 40) * 40;
        this.passabilityInOneBox(grid);
        // console.log(this.bounds);
    },

    passabilityInOneBox: function (grid) {
        const i = Math.floor(this.position.y/40);
        const j = Math.floor(this.position.x/40);
        this.passablility.left = grid[i][j-1] == 0;
        this.passablility.right = grid[i][j+1] == 0;
        this.passablility.top = grid[i-1][j] == 0;
        this.passablility.bottom = grid[i+1][j] == 0;
    },

    towBoxesBoundsHoriz: function (grid) {
        this.bounds.left = Math.floor(this.position.x / 40) * 40;
        this.bounds.top = Math.floor(this.position.y / 40) * 40
        this.bounds.right = Math.ceil((this.position.x/ 40)+1) * 40;
        this.bounds.bottom = Math.ceil(this.position.y / 40) * 40;

        this.passabilityIntowBoxesHoriz(grid);
    },

    passabilityIntowBoxesHoriz: function(grid) {
        const i = Math.floor(this.position.y/40);
        const j = Math.floor(this.position.x/40);

        this.passablility.left = grid[i][j-1] == 0;
        this.passablility.right = grid[i][j+2] == 0;
        this.passablility.top = grid[i-1][j] == 0 && grid[i-1][j+1] == 0;
        this.passablility.bottom = grid[i+1][j] == 0 && grid[i+1][j+1] == 0;
    },

    towBoxesBoundsVert: function (grid) {
        this.bounds.left = Math.floor(this.position.x / 40) * 40;
        this.bounds.top = Math.floor(this.position.y / 40) * 40;
        this.bounds.right = Math.ceil(this.position.x / 40) * 40;
        this.bounds.bottom = Math.ceil((this.position.y/ 40)+1) * 40;
        this.passabilityIntowBoxesVert(grid);
        
        
    },

    passabilityIntowBoxesVert: function(grid) {
        const i = Math.floor(this.position.y/40);
        const j = Math.floor(this.position.x/40);

        this.passablility.top = grid[i-1][j] == 0;
        this.passablility.bottom = grid[i+2][j] == 0;
        this.passablility.left = grid[i][j-1] == 0 && grid[i+1][j+1] == 0;
        this.passablility.right = grid[i+1][j-1] == 0 && grid[i+1][j+1] == 0;
    },


    move: function (direction, grid) {
        const playerRects = this.element.getBoundingClientRect();

        if (direction == "Right") {
            this.moveRight(grid, playerRects)
        } else if (direction == "Left") {
            this.moveLeft(grid, playerRects)
        } else if (direction == "Up") {
            this.moveUp(grid, playerRects)
        } else {
            this.moveDown(grid, playerRects)
        }

        if (((this.position.x + 26 <= (Math.ceil(this.position.x / 40)) * 40) && this.position.x >= (Math.floor(this.position.x / 40)) * 40) && 
            ((this.position.y + 28 <= (Math.ceil(this.position.y / 40)) * 40) && this.position.y >= (Math.floor(this.position.y / 40)) * 40)) {
                // console.log("x");
                
                this.oneBoxBounds(grid)
        }

        this.element.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
    },

    moveRight: function (grid, playerRects) {
        if ((this.position.x+27) + SPEED <= this.bounds.right && this.alive) {
            this.position.x += SPEED;
        } else {
            if (this.passablility.right && this.alive) {
                this.position.x += SPEED;
                this.towBoxesBoundsHoriz(grid);
                // console.log(this.bounds, this.passablility);
            }
        }

        // c
        // if (playerRects.left + 12 > this.bounds.right) {
        //     this.currentCell.j++;
        //     // this.updateBounds(grid);
        // }
    },

    moveLeft: function (grid, playerRects) {
        if (this.position.x - SPEED >= this.bounds.left && this.alive) {
            this.position.x -= SPEED;
        } else {
            if (this.passablility.left && this.alive) {
                this.position.x -= SPEED;
                this.towBoxesBoundsHoriz(grid);
                // console.log(this.bounds, this.passablility);
                
            }
        }

        // if (playerRects.right - 13 < this.bounds.left) {
        //     this.currentCell.j--;
        //     // this.updateBounds(grid);
        // }

    },

    moveDown: function (grid, playerRects) {
        if (this.position.y+ 28 + SPEED <= this.bounds.bottom && this.alive) {
            this.position.y += SPEED;
        } else {
            if (this.passablility.bottom && this.alive) {
                this.position.y += SPEED;
                // console.log(this.position.y);
                
                this.towBoxesBoundsVert(grid);
                // console.log(this.passablility, this.bounds);
                
            }
        }

        // if (playerRects.top + 20 > this.bounds.bottom) {
        //     this.currentCell.i++;
        //     this.updateBounds(grid);
        // }


    },

    moveUp: function (grid, playerRects) {
        if (this.position.y - SPEED >= this.bounds.top && this.alive) {
            this.position.y -= SPEED;
        } else {
            if (this.passablility.top && this.alive) {
                // this.position.x = Math.round(this.position.x/40)*40
                this.position.y -= SPEED;
                this.towBoxesBoundsVert(grid)
            }
        }

        // if (playerRects.bottom - 20 < this.bounds.top) {
        //     this.currentCell.i--;
        //     this.updateBounds(grid);
        // }
    },

}




