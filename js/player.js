import { mapCells } from "./map.js";
const SPEED = 2;


export let animation = {
    id: null
};

export const player = {
    element: document.getElementById("player"),
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

    updatePassability: function (grid) {
        this.passablility.left = grid[this.currentCell.i][this.currentCell.j-1] == 0;
        this.passablility.top = grid[this.currentCell.i-1][this.currentCell.j] == 0;
        this.passablility.right = grid[this.currentCell.i][this.currentCell.j+1] == 0;
        this.passablility.bottom = grid[this.currentCell.i+1][this.currentCell.j] == 0;
    },

    updateBounds: function (grid) {
        const playerCell = mapCells[`cell${this.currentCell.i}#${this.currentCell.j}`];
        
        for (let bound in this.bounds) {
            this.bounds[bound] = playerCell.getBoundingClientRect()[bound];
        }
        
        this.updatePassability(grid);
    },

    move: function(direction, grid) {
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
        
    },

    moveRight: function (grid, playerRects) {
        if (playerRects.right + SPEED <= this.bounds.right ) {
            this.position.x += SPEED;
        } else {
            if (this.currentCell.i == this.targetCell.i && this.passablility.right) {
                this.position.x += SPEED;
            }
            if (this.passablility.right && grid[this.targetCell.i][this.targetCell.j+1] == 0) {
                // this.position.x += SPEED;
            }
        }

        if (playerRects.left+10 > this.bounds.right) {
            this.currentCell.j++;
            this.updateBounds(grid);
        }

        // target cell
        if (playerRects.right > this.bounds.right && this.currentCell.j == this.targetCell.j) {
            this.targetCell.j = this.currentCell.j+1;
            console.log(this.targetCell);
            
        }
    },

    moveLeft: function (grid, playerRects) {
        if (playerRects.left - SPEED >= this.bounds.left) {
            this.position.x -= SPEED;
        } else {
            if (this.passablility.left) {
                this.position.x -= SPEED;
            }
        }

        if (playerRects.right-10 < this.bounds.left) {
            this.currentCell.j--;
            this.updateBounds(grid);
        }

        if (playerRects.left < this.bounds.left && this.currentCell.j == this.targetCell.j) {
            this.targetCell.j = this.currentCell.j-1;
        }
    },

    moveDown: function (grid, playerRects) {
        if (playerRects.bottom + SPEED <= this.bounds.bottom) {
            this.position.y += SPEED;
        } else {
            if (this.passablility.bottom) {
                this.position.y += SPEED;
            }
        }

        if (playerRects.top+10 > this.bounds.bottom) {
            this.currentCell.i++;
            this.updateBounds(grid);
        }

        if (playerRects.bottom > this.bounds.bottom && this.currentCell.i == this.targetCell.i) {
            this.targetCell.i = this.currentCell.i+1;
            console.log(this.targetCell);
        }
    },

    moveUp: function (grid, playerRects) {
        if (playerRects.top - SPEED >= this.bounds.top /*&& grid[this.targetCell.i-1][this.targetCell.j]==0*/) {
            this.position.y -= SPEED;
        } else {
            if (this.passablility.top) {
                this.position.y -= SPEED;
            }
        }

        if (playerRects.bottom-10 < this.bounds.top) {
            this.currentCell.i--;
            this.updateBounds(grid);
        }

        if (playerRects.top < this.bounds.top && this.currentCell.i == this.targetCell.i) {
            this.targetCell.i = this.currentCell.i-1;
        }
    },
}




