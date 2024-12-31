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

    targetCell: {
        i: 1,
        j: 1,
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
        frameWidth: 27,
        frameHeight: 40,
        currentFrame: 0,
        frameCount: 4,
        lastUpdate: 0,
        animationSpeed: 95,
        direction: {
            down: 0,
            left: 40,
            up: 80,
            right: 120,
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

    updatePassability: function (grid) {
        this.passablility.left = grid[this.currentCell.i][this.currentCell.j - 1] == 0;
        this.passablility.top = grid[this.currentCell.i - 1][this.currentCell.j] == 0;
        this.passablility.right = grid[this.currentCell.i][this.currentCell.j + 1] == 0;
        this.passablility.bottom = grid[this.currentCell.i + 1][this.currentCell.j] == 0;
    },

    updateBounds: function (grid) {
        const playerCell = mapCells[`cell${this.currentCell.i}#${this.currentCell.j}`];

        for (let bound in this.bounds) {
            this.bounds[bound] = playerCell.getBoundingClientRect()[bound];
        }
        // console.log(this.bounds.right, this.element.getBoundingClientRect().right);

        this.updatePassability(grid);
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

        this.element.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`
        // console.log("posi", this.position, "bond=>", this.element.getBoundingClientRect().right);

    },

    moveRight: function (grid, playerRects, x) {
        if (playerRects.right + SPEED <= this.bounds.right && this.alive) {
            this.position.x += SPEED;
            this.sprite.x++;
            if (this.sprite.x % this.sprite.speed) {
                this.sprite.right++;
            }
            this.element.style.backgroundPosition = `-${this.sprite.right % 4 * this.sprite.frameWidth}px -120px`

        } else {
            if (this.passablility.right && this.alive) {
                this.position.y = Math.round(this.position.y/40)*40
                this.position.x += SPEED;
            }
        }

        if (playerRects.left + 13 > this.bounds.right) {
            this.currentCell.j++;
            this.updateBounds(grid);
        }


        if (playerRects.right > this.bounds.right ) {
            // this.targetCell.j = this.currentCell.j - 1;
            // console.log('pass');
            
        }
        console.log(this.position)

    },

    moveLeft: function (grid, playerRects) {
        if (playerRects.left - SPEED >= this.bounds.left && this.alive) {
            this.position.x -= SPEED;
        } else {
            if (this.passablility.left && this.alive) {
                this.position.y = Math.round(this.position.y/40)*40
                this.position.x -= SPEED;
            }
        }

        if (playerRects.right - 13 < this.bounds.left) {
            this.currentCell.j--;
            this.updateBounds(grid);
        }

        if (playerRects.left < this.bounds.left ) {
            // this.targetCell.j = this.currentCell.j - 1;
            // console.log('pass'); 
            
        }
    },

    moveDown: function (grid, playerRects) {
        if (playerRects.bottom + SPEED <= this.bounds.bottom && this.alive) {
            this.position.y += SPEED;
        } else {
            if (this.passablility.bottom && this.alive) {
                this.position.x = Math.round(this.position.x/40)*40
                this.position.y += SPEED;
            }
        }

        if (playerRects.top + 20 > this.bounds.bottom) {
            this.currentCell.i++;
            this.updateBounds(grid);
        }

        // target cell
        if (playerRects.bottom > this.bounds.bottom) {
            this.targetCell.i = this.currentCell.i + 1;
        }
    },

    moveUp: function (grid, playerRects) {
        if (playerRects.top - SPEED >= this.bounds.top && this.alive) {
            this.position.y -= SPEED;
        } else {
            if (this.passablility.top && this.alive) {
                this.position.x = Math.round(this.position.x/40)*40
                this.position.y -= SPEED;
            }
        }

        if (playerRects.bottom - 20 < this.bounds.top) {
            this.currentCell.i--;
            this.updateBounds(grid);
        }

        // target cell
        if (playerRects.top < this.bounds.top && this.currentCell.i == this.targetCell.i) {
            this.targetCell.i = this.currentCell.i - 1;
        }
    },

}




