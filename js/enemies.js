import { mapCells } from "./map.js";
import { bomb } from "./bomb.js";
import { cellSize } from "./main.js";
export const enimiesNumber = 3;
const horz = 1, vert = -1;


export class enemy {
    constructor() {
        this.element = null;
        this.cell = { i: 0, j: 0 };
        // this.width = 17;
        // this.hight = 17;
        // this.position = { x: 0, y: 0 };
        this.positionInCell = { x: 11.5, y: 11.5 };
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
            frameCount: 5,
            currentFrame: 0,
            lastUpdate: 0,
            animationSpeed: 180,
        }
    }

    updatPassability(grid) {
        this.passability.right = grid[this.cell.i][this.cell.j + 1] == 0;
        this.passability.left = grid[this.cell.i][this.cell.j - 1] == 0;
        this.passability.bottom = grid[this.cell.i + 1][this.cell.j] == 0;
        this.passability.top = grid[this.cell.i - 1][this.cell.j] == 0;
    }

    create(i, j) {
        const enimieCell = mapCells[`cell${i}#${j}`];
        const pxToCenter = Math.floor((cellSize-(cellSize*0.8))/2)
        this.element = document.createElement('div');
        this.element.classList.add('enemy');
        this.element.style.transform = `translate(${pxToCenter}px, ${pxToCenter}px)`;
        this.cell.i = i;
        this.cell.j = j;

        this.axis = (Math.random() > 0.5 ? horz : vert);

        enimieCell.appendChild(this.element);
    }

    move(grid) {
        if (this.axis == horz) {

            const steps = 1 * this.direction;
            this.positionInCell.x += steps;

            if (this.direction == 1) {
                if ((this.positionInCell.x + 17) <= this.bounds.right) {
                    this.element.style.transform = `translate(${this.positionInCell.x}px, ${this.positionInCell.y}px)`;
                    // if (this.collision()) {
                    //     this.direction = -1;
                    // }
                } else {
                    this.passability.right = grid[this.cell.i][this.cell.j + 1] == 0;
                    this.passability.left = grid[this.cell.i][this.cell.j - 1] == 0;
                    if (this.passability.right) {
                        if (bomb.cell && (this.cell.j + 1 == bomb.cell.j && this.cell.i == bomb.cell.i)
                           ) {
                            this.direction = -1;
                        } else {
                            this.bounds.right += 40;
                            this.bounds.left += 40;
                            this.cell.j++;
                            this.passability.right = grid[this.cell.i][this.cell.j + 1] == 0;
                            this.passability.left = grid[this.cell.i][this.cell.j - 1] == 0;
                        }

                    } else {
                        this.direction = -1
                    }
                }
            } else {
                if ((this.positionInCell.x) >= this.bounds.left) {
                    this.element.style.transform = `translate(${this.positionInCell.x}px, ${this.positionInCell.y}px)`;
                } else {
                    
                    if (this.passability.left) {
                        if (bomb.cell && (this.cell.j - 1 == bomb.cell.j && this.cell.i == bomb.cell.i)) {
                            this.direction = 1
                        } else {
                            this.bounds.left -= 40;
                            this.bounds.right -= 40;
                            this.cell.j--;
                            this.passability.left = grid[this.cell.i][this.cell.j - 1] == 0;
                            this.passability.right = grid[this.cell.i][this.cell.j + 1] == 0;
                        }

                    } else {
                        this.direction = 1
                    }
                }
            }

        } else {

            const steps = 1 * this.direction;
            this.positionInCell.y += steps;

            if (this.direction == 1) {
                if ((this.positionInCell.y + 17) <= this.bounds.bottom) {
                    this.element.style.transform = `translate(${this.positionInCell.x}px, ${this.positionInCell.y}px)`;
                } else {
                    this.passability.bottom = grid[this.cell.i + 1][this.cell.j] == 0;
                    this.passability.top = grid[this.cell.i - 1][this.cell.j] == 0;
                    if (this.passability.bottom) {
                        if (bomb.cell && (this.cell.j  == bomb.cell.j && this.cell.i+1 == bomb.cell.i)) {
                            this.direction = -1
                        } else {
                            this.bounds.bottom += 40;
                            this.bounds.top += 40;
                            this.cell.i++;
                            this.passability.bottom = grid[this.cell.i + 1][this.cell.j] == 0;
                            this.passability.top = grid[this.cell.i - 1][this.cell.j] == 0;
                        }

                    } else {
                        this.direction = -1
                    }
                }
            } else {
                if ((this.positionInCell.y) >= this.bounds.top) {
                    this.element.style.transform = `translate(${this.positionInCell.x}px, ${this.positionInCell.y}px)`;
                } else {
                    if (this.passability.top) {
                        if (bomb.cell && (this.cell.j == bomb.cell.j && this.cell.i-1 == bomb.cell.i)) {
                            this.direction = 1
                        } else {
                            this.bounds.top -= 40;
                            this.bounds.bottom -= 40;
                            this.cell.i--;
                            this.passability.top = grid[this.cell.i - 1][this.cell.j] == 0;
                            this.passability.bottom = grid[this.cell.i + 1][this.cell.j] == 0;
                        }

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

            const x = this.sprite.currentFrame * (cellSize*0.8);
            this.element.style.backgroundPosition = `-${x}px 0px`;
        }
    }

    // collision() {
    //     enimies.forEach((enimy => {
    //         if (enimy != this) {
    //             if (((this.position.x <= (enimy.position.x+17) || (this.position.x+17) >= enimy.position.x) && this.cell.i == enimy.cell.i)
    //             || ((this.position.y <= (enimy.position.y+17) || (this.position.y+17) >= (enimy.position.y))&& this.cell.j == enimy.cell.j)) {
    //         // console.log("coli");
    //                 return true
                    
    //             }
    //         }
    //     }))

    //     return false
    // }
}