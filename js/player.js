import { mapCells } from "./map.js";
const SPEED = 2.5;

export let animation = {
    id: null
};

export const player = {
    element: document.getElementById("player"),
    cell: {
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

    neighborCells: {
        left: { border: 0, canPass: false },
        top: { border: 0, canPass: false },
        right: { border: 0, canPass: false },
        bottom: { border: 0, canPass: false },
    },

    updateNeighborCells: function (grid) {
        const leftCell = mapCells[`cell${this.cell.i}#${this.cell.j - 1}`];
        const topCell = mapCells[`cell${this.cell.i - 1}#${this.cell.j}`];
        const rightCell = mapCells[`cell${this.cell.i}#${this.cell.j + 1}`];
        const bottomtCell = mapCells[`cell${this.cell.i + 1}#${this.cell.j}`];

        this.neighborCells.left.border = leftCell.getBoundingClientRect().right;
        this.neighborCells.left.canPass = grid[this.cell.i][this.cell.j - 1] == 0;

        this.neighborCells.top.border = topCell.getBoundingClientRect().bottom;
        this.neighborCells.top.canPass = grid[this.cell.i - 1][this.cell.j] == 0;

        this.neighborCells.right.border = rightCell.getBoundingClientRect().left;
        this.neighborCells.right.canPass = grid[this.cell.i][this.cell.j + 1] == 0;

        this.neighborCells.bottom.border = bottomtCell.getBoundingClientRect().top;
        this.neighborCells.bottom.canPass = grid[this.cell.i + 1][this.cell.j] == 0;
    },

    move: function (direction, grid) {
        const playerCellElement = mapCells[`cell${this.cell.i}#${this.cell.j}`];
        
        const playerRects = this.element.getBoundingClientRect();
        const cellRects = playerCellElement.getBoundingClientRect();
        // console.log("cell =>",cellRects);
        // console.log("player =>",playerRects);

        if (direction == "Right") {
            if (playerRects.right >= this.neighborCells.right.border) {
                if (this.neighborCells.right.canPass && grid[this.targetCell.i][this.targetCell.j] == 0) {
                    this.position.x += SPEED;
                }
            } else {
                this.position.x += SPEED;
            }

            if (playerRects.right > this.neighborCells.right.border && this.cell.j == this.targetCell.j) {
                this.targetCell.j = this.cell.j+1;
                // this.targetCell.i = this.cell.i;
                // console.log(this.targetCell);
            }

            if (playerRects.left >= this.neighborCells.right.border) {
                console.log(this.cell);
                this.cell.j++;
                console.log(this.cell);
                
                this.updateNeighborCells(grid);
            }
            
        } else if (direction == "Left") {
            if (playerRects.left <= this.neighborCells.left.border) {
                if (this.neighborCells.left.canPass && grid[this.targetCell.i][this.targetCell.j] == 0) {
                    this.position.x -= SPEED;
                }
            } else {
                this.position.x -= SPEED;
            }

            if (playerRects.left < this.neighborCells.left.border && this.cell.j == this.targetCell.j) {
                this.targetCell.j = this.cell.j-1;
                // this.targetCell.i = this.cell.i;
                // console.log(this.targetCell);
            }

            if (playerRects.right <= this.neighborCells.left.border) {
                this.cell.j--;
                this.updateNeighborCells(grid);
            }
        } else if (direction == "Up") {
            if (playerRects.top <= this.neighborCells.top.border) {
                if (this.neighborCells.top.canPass && grid[this.targetCell.i][this.targetCell.j] == 0) {
                    this.position.y -= SPEED;
                }
            } else {
                this.position.y -= SPEED;
            }

            if (playerRects.top < this.neighborCells.top.border && this.cell.i == this.targetCell.i) {
                this.targetCell.i = this.cell.i-1;
                // this.targetCell.j = this.cell.j;
                // console.log(this.targetCell);
            }

            if (playerRects.bottom <= this.neighborCells.top.border) {
                this.cell.i--;
                this.updateNeighborCells(grid);
            }
        } else {
            if (playerRects.bottom >= this.neighborCells.bottom.border) {
                if (this.neighborCells.bottom.canPass && grid[this.targetCell.i][this.targetCell.j] == 0) {
                    this.position.y += SPEED;
                }
            } else {
                this.position.y += SPEED;
            }

            if (playerRects.bottom > this.neighborCells.bottom.border && this.cell.i == this.targetCell.i) {
                this.targetCell.i = this.cell.i+1;
                // this.targetCell.j = this.cell.j;
                // console.log(this.targetCell);
            }

            if (playerRects.top >= this.neighborCells.bottom.border) {
                this.cell.i++;
                this.updateNeighborCells(grid);
            }
        }

        if (playerRects.top > cellRects.top && playerRects.left > cellRects.left && playerRects.right < cellRects.right && playerRects.bottom < cellRects.bottom) {
            // console.log("yes");
            
            this.targetCell.i = this.cell.i;
            this.targetCell.j = this.cell.j;
        }

        this.element.style.transform = `translate(${player.position.x}px, ${player.position.y}px)`
        animation.id = requestAnimationFrame(() => this.move(direction, grid))
    }
}