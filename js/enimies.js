import { mapCells } from "./map.js";
export const enimiesNumber = 3;
const horz = 1, vert = 0;


export class enimie {
    constructor() {
        this.element = null;
        this.cell = { i: 0, j: 0 };
        this.position = { x: 0, y: 0 };
        this.positionInCell = { x: 0, y: 0 };
        this.axis = null;
        this.direction = 1;
        this.bounds = {
            right: 40,
            left: 0,
            top: 0,
            bottom: 40
        }
        this.passability = {
            right: false,
            left: false,
            top: false,
            bottom: false
        }
        this.sprite = {
            width: 17,
            frameCount: 5,
            currentFrame: 0,
            lastUpdate: 0,
            animationSpeed: 180,
        }
    }

    updatPassability(grid) {
        this.passability.right = grid[this.cell.i][this.cell.j+1] == 0;
        this.passability.left = grid[this.cell.i][this.cell.j-1] == 0;
        this.passability.bottom = grid[this.cell.i+1][this.cell.j] == 0;
        this.passability.top = grid[this.cell.i-1][this.cell.j] == 0;
    }

    create(i, j) {
        const enimieCell = mapCells[`cell${i}#${j}`];
        this.element = document.createElement('div');
        this.element.classList.add('enimie');
        this.cell.i = i;
        this.cell.j = j;
        this.position.x = j * 40 + 7.5;
        this.position.y = i * 40 + 11;

        this.axis = (Math.random() > 0.5 ? horz : vert);
        console.log(this.axis);

        enimieCell.appendChild(this.element);
    }

    move(grid) {
        if (this.axis == horz) {

            const steps = 1 * this.direction;
            this.positionInCell.x += steps;

            if (this.direction == 1) {
                if ((this.positionInCell.x + 17) <= this.bounds.right) {
                    this.element.style.transform = `translate(${this.positionInCell.x}px, 11.5px)`;
                } else {
                    if (this.passability.right) {
                        this.bounds.right += 40;
                        this.bounds.left += 40;
                        this.cell.j++;
                        this.passability.right = grid[this.cell.i][this.cell.j+1] == 0;
                        this.passability.left = grid[this.cell.i][this.cell.j-1] == 0;
                        // console.log(this.bounds, this.cell);
                        
                    } else {
                        this.direction = -1
                    }
                }
            } else {
                if ((this.positionInCell.x) >= this.bounds.left) {
                    this.element.style.transform = `translate(${this.positionInCell.x}px, 11.5px)`;
                } else {
                    if (this.passability.left) {
                        this.bounds.left -= 40;
                        this.bounds.right -= 40;
                        this.cell.j--;
                        this.passability.left = grid[this.cell.i][this.cell.j-1] == 0;
                        this.passability.right = grid[this.cell.i][this.cell.j+1] == 0;
                        // console.log(this.bounds);
                        
                    } else {
                        this.direction = 1
                    }
                }
            }

        }
    }

    animate(currentTime) {
        if (currentTime - this.sprite.lastUpdate > this.sprite.animationSpeed) {
            this.sprite.currentFrame = (this.sprite.currentFrame + 1) % this.sprite.frameCount;
            this.sprite.lastUpdate = currentTime;

            const x = this.sprite.currentFrame * this.sprite.width;
            this.element.style.backgroundPosition = `-${x}px 0px`;
        }
    }
}