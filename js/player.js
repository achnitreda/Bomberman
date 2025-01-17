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

    setPlayerProperties: function (cellsize) {
        this.speed = Math.ceil(4 * cellsize / 100)
        this.size = Math.round(cellsize * 0.8);

        const pxToCenter = Math.floor((cellsize - this.size) * 0.5);
        this.position.x = (this.currentCell.j * cellsize) + pxToCenter;
        this.position.y = (this.currentCell.i * cellsize) + pxToCenter;
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
        this.element.style.backgroundPosition = `-0px -0px`;
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

    move: function (direction, grid, cellSize) {
        const pxToCenter = Math.floor((cellSize - this.size) * 0.5);
        const centerY = (Math.floor((this.position.y + (this.size * 0.5)) / cellSize) * cellSize) + pxToCenter;
        const centerX = (Math.floor((this.position.x + (this.size * 0.5)) / cellSize) * cellSize) + pxToCenter;

        switch (direction) {
            case "Right": this.moveRight(centerY); break;
            case "Left": this.moveLeft(centerY); break;
            case "Up": this.moveUp(centerX); break;
            case "Down": this.moveDown(centerX); break;
        }

        // Boundary check
        const rightBound = (Math.ceil(this.position.x / cellSize)) * cellSize;
        const leftBound = (Math.floor(this.position.x / cellSize)) * cellSize;
        const bottomBound = (Math.ceil(this.position.y / cellSize)) * cellSize;
        const topBound = (Math.floor(this.position.y / cellSize)) * cellSize;


        const boundsX = this.position.x + this.size <= rightBound && this.position.x >= leftBound
        const boundsY = this.position.y + this.size <= bottomBound && this.position.y >= topBound

        if (boundsX && boundsY) {
            this.updateBounds(grid, cellSize);
        }

        // player cell
        this.currentCell.j = Math.floor((this.position.x + (this.size * 0.5)) / cellSize);
        this.currentCell.i = Math.floor((this.position.y + (this.size * 0.5)) / cellSize);

        // move player
        this.element.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
    },

    moveRight: function (centerY) {

        const verticalOffset = Math.abs(centerY - this.position.y);
        const ALIGNMENT_TOLERANCE = this.speed;

        // console.log("---------- Right ----------")
        // console.log("centerY", centerY)
        // console.log("this.position.y: ", this.position.y)
        // console.log("verticalOffset", verticalOffset)
        // console.log("ALIGNMENT_TOLERANCE", ALIGNMENT_TOLERANCE)
        // console.log(verticalOffset > ALIGNMENT_TOLERANCE)

        const canMoveRight = (this.position.x + this.size + this.speed <= this.bounds.right) || (this.passablility.right)

        if (verticalOffset > ALIGNMENT_TOLERANCE) {
            this.position.y += centerY > this.position.y ? this.speed : -this.speed;
        }

        if (canMoveRight && verticalOffset <= ALIGNMENT_TOLERANCE) {
            this.position.x += this.speed;
        }
    },

    moveLeft: function (centerY) {

        const canMoveLeft = (this.position.x - this.speed >= this.bounds.left) ||
            this.passablility.left;

        const verticalOffset = Math.abs(centerY - this.position.y);
        const ALIGNMENT_TOLERANCE = this.speed;


        // console.log("---------- left ----------")
        // console.log("centerY", centerY)
        // console.log("this.position.y: ", this.position.y)
        // console.log("verticalOffset", verticalOffset)
        // console.log("ALIGNMENT_TOLERANCE", ALIGNMENT_TOLERANCE)
        // console.log(verticalOffset > ALIGNMENT_TOLERANCE)

        if (verticalOffset > ALIGNMENT_TOLERANCE) {
            this.position.y += (centerY > this.position.y) ? this.speed : -this.speed;
            return
        }

        if (canMoveLeft && verticalOffset <= ALIGNMENT_TOLERANCE) {
            this.position.x -= this.speed;
        }
    },

    moveDown: function (centerX) {

        const canMoveDown = (this.position.y + this.size + this.speed <= this.bounds.bottom) || (this.passablility.bottom)

        const horizontalOffset = Math.abs(centerX - this.position.x)
        const ALIGNMENT_TOLERANCE = this.speed;

        // console.log("---------- Down ----------")
        // console.log("centerY", centerX)
        // console.log("this.position.y: ", this.position.x)
        // console.log("horizontalOffset", horizontalOffset)
        // console.log("ALIGNMENT_TOLERANCE", ALIGNMENT_TOLERANCE)
        // console.log(horizontalOffset > ALIGNMENT_TOLERANCE)

        if (horizontalOffset > ALIGNMENT_TOLERANCE) {
            this.position.x += centerX > this.position.x ? this.speed : -this.speed;
        }

        if (canMoveDown && horizontalOffset <= ALIGNMENT_TOLERANCE) {
            this.position.y += this.speed;
        }
    },

    moveUp: function (centerX) {

        const canMoveUp = (this.position.y - this.speed >= this.bounds.top) || (this.passablility.top)

        const horizontalOffset = Math.abs(centerX - this.position.x)
        const ALIGNMENT_TOLERANCE = this.speed;

        // console.log("---------- UP ----------")
        // console.log("centerY", centerX)
        // console.log("this.position.y: ", this.position.x)
        // console.log("horizontalOffset", horizontalOffset)
        // console.log("ALIGNMENT_TOLERANCE", ALIGNMENT_TOLERANCE)
        // console.log(horizontalOffset > ALIGNMENT_TOLERANCE)

        if (horizontalOffset > ALIGNMENT_TOLERANCE) {
            this.position.x += (centerX > this.position.x) ? this.speed : -this.speed;
        }

        if (canMoveUp && horizontalOffset <= ALIGNMENT_TOLERANCE) {
            this.position.y -= this.speed;
        }
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

export { player };