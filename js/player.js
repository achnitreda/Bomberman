import { enimies } from "./map.js";

// player should be bigger!!!!!!
const SPEED = 2;
export let urgentMove = "";


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
        y: 46
    },

    bounds: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
    },

    update: false,

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
        animationSpeed: 75,
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
    },

    passabilityInOneBox: function (grid) {
        const i = Math.floor(this.position.y / 40);
        const j = Math.floor(this.position.x / 40);

        this.passablility.left = grid[i][j - 1] == 0;
        this.passablility.right = grid[i][j + 1] == 0;
        this.passablility.top = grid[i - 1][j] == 0;
        this.passablility.bottom = grid[i + 1][j] == 0;
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
            ((this.position.y + 28 <= (Math.ceil(this.position.y / 40)) * 40) && this.position.y >= (Math.floor(this.position.y / 40)) * 40) && !this.update) {
                this.oneBoxBounds(grid);
        }

        this.element.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;

        // player cell
        this.currentCell.j = Math.floor((this.position.x + 13) / 40);
        this.currentCell.i = Math.floor((this.position.y + 14) / 40);
        this.enimyColision();

    },

    moveRight: function () {
        const targetY = (Math.floor((this.position.y + 14) / 40) * 40) + 6;
        const targetX = (Math.floor((this.position.x + 13) / 40) * 40) + 7;

        if (targetY != this.position.y) {
            urgentMove = (targetY > this.position.y) ? "Down" : "Up";
            return
        }



        if ((this.position.x + 26) + SPEED <= this.bounds.right && this.alive) {
            // this.position.y = (Math.floor((this.position.y + 14) / 40) * 40) + 6;
            this.position.x += SPEED;
        } else {
            if (this.passablility.right && this.alive) {
                // this.position.y = (Math.floor((this.position.y + 14) / 40) * 40) + 6;
                this.position.x += SPEED;
            }
        }

        if (urgentMove && this.position.x == targetX) urgentMove = "";
    },

    moveLeft: function () {
        const targetY = (Math.floor((this.position.y + 14) / 40) * 40) + 6;
        const targetX = (Math.floor((this.position.x + 13) / 40) * 40) + 7;
        if (targetY != this.position.y) {
            urgentMove = (targetY > this.position.y) ? "Down" : "Up";
            return
        }


        if (this.position.x - SPEED >= this.bounds.left && this.alive) {
            // this.position.y = (Math.floor((this.position.y + 14) / 40) * 40) + 6;
            this.position.x -= SPEED;
        } else {
            if (this.passablility.left && this.alive) {
                // this.position.y = (Math.floor((this.position.y + 14) / 40) * 40) + 6;
                this.position.x -= SPEED;
            }
        }

        if (urgentMove && this.position.x == targetX) urgentMove = "";
    },

    moveDown: function () {
        const targetY = (Math.floor((this.position.y + 14) / 40) * 40) + 6;
        const targetX = (Math.floor((this.position.x + 13) / 40) * 40) + 7;
        if (targetX != this.position.x) {
            urgentMove = (targetX > this.position.x) ? "Right" : "Left";
            return
        }


        if (this.position.y + 26 + SPEED <= this.bounds.bottom && this.alive) {
            // this.position.x = (Math.floor((this.position.x + 13) / 40) * 40) + 7;
            this.position.y += SPEED;
        } else {
            if (this.passablility.bottom && this.alive) {
                // this.position.x = (Math.floor((this.position.x + 13) / 40) * 40) + 7;
                this.position.y += SPEED;
            }
        }

        if (urgentMove && this.position.y == targetY) urgentMove = "";
    },

    moveUp: function () {
        const targetY = (Math.floor((this.position.y + 14) / 40) * 40) + 6;
        const targetX = (Math.floor((this.position.x + 13) / 40) * 40) + 7;
        if (targetX != this.position.x) {
            urgentMove = (targetX > this.position.x) ? "Right" : "Left";
            return
        }

        if (this.position.y - SPEED >= this.bounds.top && this.alive) {
            // this.position.x = (Math.floor((this.position.x + 13) / 40) * 40) + 7;
            this.position.y -= SPEED;
        } else {
            if (this.passablility.top && this.alive) {
                // this.position.x = (Math.floor((this.position.x + 13) / 40) * 40) + 7;
                this.position.y -= SPEED;
            }
        }

        if (urgentMove && this.position.y == targetY) urgentMove = "";
    },

    death: function() {
        player.alive = false;
        player.position.x = 47;
        player.position.y = 46;
        player.currentCell.i = 1;
        player.currentCell.j = 1;
        setTimeout(() => {
            player.alive = true;
            player.element.style.transform = `translate(${player.position.x}px, ${player.position.y}px)`;
        }, 1500)
    },

    enimyColision : function() {
        enimies.forEach(enimy => {
            if ((this.currentCell.i == enimy.cell.i && this.currentCell.j == enimy.cell.j)) this.death()
        })
    }
}




