import { enimie, enimiesNumber } from "./enimies.js";

export const mapCells = {}; // store theme whene they created and avoid quering DOM  evry time we need a cell
export const enimieCells = [];
export let gateCell = null;
// const bomberman = new Image();
const mapWidth = 15;
const mapHeight = 13;
const empty = 0;
const soft = 1;
const solid = 2;
const softs = []; // store soft blocks indexes to chose on random for the gate
export const enimies = []
const randomNumber = () => (Math.random() < 0.6) ? empty : soft;
function getRandomIndexes() {
    const nums = new Set();
    console.log(enimieCells);
    
    while(nums.size < enimiesNumber) {
        nums.add(Math.floor(Math.random() * enimieCells.length));
    }
    return Array.from(nums);
}

function addEnimies (grid) {
    getRandomIndexes().forEach((el) => {
        const [i, j] = enimieCells[el];
        const $enimie = new enimie();
        $enimie.create(i, j);
        $enimie.updatPassability(grid);
        // console.log($enimie.passability);
        
        enimies.push($enimie)
        // console.log($enimie.bounds);
    })

    // setInterval(()=> {
    //     enimies.forEach(enimie => {
    //         enimie.axis *= -1;
    //     })
    // }, 1000)
    
}

function mapGrid() {
    const grid = [];
    for (let i = 0; i < mapHeight; i++) {
        grid[i] = [];
        for (let j = 0; j < mapWidth; j++) {
            if (i == 0 || i == mapHeight - 1 || j == 0 || j == mapWidth - 1) {
                // corners
                grid[i][j] = solid;
            } else if (i == 1 && j == 1 || i == 1 && j == 2 || i == 2 && j == 1) {
                // ensure player right and bottom cells are empty 
                grid[i][j] = empty;
            } else if (i % 2 == 0 && j % 2 == 0) {
                // solide blocks inside the map
                grid[i][j] = solid;
            } else {
                // random blocks either soft or empty 
                const rand = randomNumber();
                grid[i][j] = rand;

                // store soft blocks indexes
                if (rand == soft) {
                    softs.push([i, j])
                }
            }
        }
    }

    // random gate cell
    gateCell = softs[Math.floor(Math.random() * softs.length)];
    // console.log(gateCell);
    
    // console.log(gateCell);

    return grid;
}

export function mapVisual(map, player) {
    const grid = mapGrid();
    // console.log(grid)
    // let enimieAdded = 0;
    grid.forEach((row, i) => {
        row.forEach((el, j) => {
            const cell = document.createElement('div');
            cell.classList.add('cell')
            if (el == solid) {
                cell.classList.add('solidWall')
            } else if (el == soft) {
                cell.classList.add('softWall')
            } else {
                cell.classList.add('empty')
                if (i >= 2 && j>1 && (i+1)%2 == 0 && (j+1)%2== 0) {
                    enimieCells.push([i, j])
                }
            }

            cell.id = `cell${i}#${j}`
            mapCells[`cell${i}#${j}`] = cell;
            map.appendChild(cell)
        })
    });

    addEnimies(grid);
    player.oneBoxBounds(grid);
    return grid;
}

