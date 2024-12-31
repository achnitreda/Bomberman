import { mapCells } from "./map.js";
export const enimiesNumber = 3;
const horz = 1, vert = 0;


export class enimie {
    constructor() {
        this.element = null;
        this.cell = {i:0 , j: 0};
        this.direction = null;
    }

    create(i, j) {
        const enimieCell = mapCells[`cell${i}#${j}`];
        this.element = document.createElement('div');
        this.element.classList.add('enimie');
        this.cell.i = i;
        this.cell.j = j;
        this.direction = (Math.random() > 0.33 ? horz: vert);
        enimieCell.appendChild(this.element);
    }
}