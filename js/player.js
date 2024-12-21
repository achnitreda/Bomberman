const SPEED = 3.5;

export let animation = {
    id: null
};

export const player = {
    element: document.getElementById("player"),
    cell: {
        i: 1,
        j: 1
    },

    position: {
        x: 0,
        y: 0
    },

    bounds: {
        left: {},
        top: {},
        right: {},
        bottom: {},
    },

    updateBounds: function(grid) {
        
        
        const leftCell = document.getElementById(`cell${this.cell.i}${this.cell.j - 1}`)
        const topCell = document.getElementById(`cell${this.cell.i - 1}${this.cell.j}`)
        const rightCell = document.getElementById(`cell${this.cell.i}${this.cell.j + 1}`)
        const bottomtCell = document.getElementById(`cell${this.cell.i + 1}${this.cell.j}`)

        this.bounds.left.bound = leftCell.getBoundingClientRect().right;
        this.bounds.left.canPass = grid[this.cell.i][this.cell.j - 1] == 0;

        this.bounds.top.bound = topCell.getBoundingClientRect().bottom;
        this.bounds.top.canPass = grid[this.cell.i - 1][this.cell.j] == 0;

        this.bounds.right.bound = rightCell.getBoundingClientRect().left;
        this.bounds.right.canPass = grid[this.cell.i][this.cell.j + 1] == 0;

        this.bounds.bottom.bound = bottomtCell.getBoundingClientRect().top;
        this.bounds.bottom.canPass = grid[this.cell.i + 1][this.cell.j] == 0;

        // console.log(player.bounds, "\n", rightCell, this.cell.i, this.cell.j);
    },

    move: function(direction, grid) {
        const rects = this.element.getBoundingClientRect();

        if (direction == "Right") {
            if (rects.right >= this.bounds.right.bound) {
                if (this.bounds.right.canPass) {
                    this.position.x += SPEED;
                }
            } else {
                this.position.x += SPEED; 
            }
            
            if (rects.left >= this.bounds.right.bound) {
                this.cell.j++;
                this.updateBounds(grid);
            }
        } else if (direction == "Left") {
            if (rects.left <= this.bounds.left.bound ) {
                if (this.bounds.left.canPass) {
                    this.position.x -= SPEED;
                }
            } else {
                this.position.x -= SPEED; 
            }
            
            if (rects.right <= this.bounds.left.bound) {
                this.cell.j--;
                this.updateBounds(grid);
            }
        } else if (direction == "Up") {
            if (rects.top <= this.bounds.top.bound) {
                if (this.bounds.top.canPass) {
                    this.position.y -= SPEED;
                }
            } else {
                this.position.y -= SPEED; 
            }
            
            if (rects.bottom <= this.bounds.top.bound) {
                this.cell.i--;
                this.updateBounds(grid);
            }
        } else {
            if (rects.bottom >= this.bounds.bottom.bound) {
                if (this.bounds.bottom.canPass) {
                    this.position.y += SPEED;
                }
            } else {
                this.position.y += SPEED; 
            }
            
            if (rects.top >= this.bounds.bottom.bound) {
                this.cell.i++;
                this.updateBounds(grid);
            }
        }

        this.element.style.transform = `translate(${player.position.x}px, ${player.position.y}px)`
        animation.id = requestAnimationFrame(() => this.move(direction, grid))
    }
}