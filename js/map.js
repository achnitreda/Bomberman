import { Enemy } from "./enemies.js";
import { gameState } from "./main.js";

export let enemiesCells = [];
// export const enemiesIndexes = [];
export let gateCell = null;
const mapWidth = 15;
const mapHeight = 13;
const empty = 0;
const soft = 1;
const solid = 2;
const specialSolid = 3;
const softs = [];
export const enemies = [];
export const stuckEnemies = [];

function randomNumber() {
    return (Math.random() < 0.6) ? empty : soft
}

function getRandomIndexes() {
    const nums = new Set();
    while (nums.size < gameState.enimiesNumber) {
        nums.add(Math.floor(Math.random() * enemiesCells.length));
    }
    return Array.from(nums);
}

function isStuck(enemy) {
    return (enemy.axis == 'hor') ? (!enemy.passability.right && !enemy.passability.left) :
        (!enemy.passability.top && !enemy.passability.bottom)
}

function addEnimies(grid) {
    const indexes = getRandomIndexes()
    // console.log(enemiesCells);
    
    // console.log(indexes);
    
    indexes.forEach((el) => {
        const [i, j] = enemiesCells[el];
        // console.log(i, j);
        const $enemy = new Enemy();
        // console.log(document.getElementById(`cell${i}#${j}`));
        $enemy.create(i, j, grid);
        if (isStuck($enemy)) stuckEnemies.push($enemy);
        enemies.push($enemy)
        // enemiesIndexes.push([i, j])
    })
}

function mapGrid() {
    const grid = [];
    for (let i = 0; i < mapHeight; i++) {
        grid[i] = [];
        for (let j = 0; j < mapWidth; j++) {

            if (i == 0 && j == 0 || i == mapHeight-1 && j == 0 || j == mapWidth-1 && i == 0 || j == mapWidth-1 && i == mapHeight-1) {
                // corners cells
                grid[i][j] = specialSolid;
            } else if (i == 0 || i == mapHeight - 1 || j == 0 || j == mapWidth - 1) {
                // walls
                grid[i][j] = solid;
            } else if (i == 1 && j == 1 || i == 1 && j == 2 || i == 2 && j == 1) {
                // ensure player right and bottom cells are empty 
                grid[i][j] = empty;
            } else if (i % 2 == 0 && j % 2 == 0) {
                // solide blocks inside the map
                grid[i][j] = specialSolid;
            } else {
                // random blocks either soft or empty 
                const rand = randomNumber();
                grid[i][j] = rand;

                // store soft blocks indexes
                if (rand == soft) softs.push([i, j])
            }
        }
    }

    // random gate cell
    gateCell = softs[Math.floor(Math.random() * softs.length)];
    console.log(gateCell);
    
    return grid;
}

export function mapVisual() {
    const grid = mapGrid();
    // console.log(grid);
    
    // player properties
    console.log(gameState.cellSize);
    
    gameState.player.setPlayerProperties(gameState.cellSize);
    
    enemiesCells = [];
    grid.forEach((row, i) => {
        row.forEach((el, j) => {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (el == specialSolid) {
                cell.classList.add('spSolid');
                cell.style.backgroundPosition = `${-2*gameState.cellSize}px ${-(gameState.stage*gameState.cellSize)}px`;
            } else if (el == solid) {
                cell.classList.add('solid');
                cell.style.backgroundPosition = `0px ${-(gameState.stage*gameState.cellSize)}px`;
            } else if (el == soft) {
                cell.classList.add('soft');
                cell.style.backgroundPosition = `${-3*gameState.cellSize}px ${-(gameState.stage*gameState.cellSize)}px`;
            } else {
                cell.classList.add('empty');
                cell.style.backgroundPosition = `${-1*gameState.cellSize}px ${-(gameState.stage*gameState.cellSize)}px`;
                if (i >= 2 && j > 1 && (i + 1) % 2 == 0 && (j + 1) % 2 == 0) {
                    enemiesCells.push([i, j])
                }
            }

            cell.id = `cell${i}#${j}`;
            gameState.board.appendChild(cell)
        })
    });

    addEnimies(grid);
    // enemiesCells.forEach(([i, j]) => {
    //     console.log(grid[i][j])
        
    // })
    
    gameState.player.updateBounds(grid, gameState.cellSize);

    return grid;
}


export function setTimer(sec, minu, timeElement) {
    const Sec = sec % 60;
    const Minu = minu % 60;
    timeElement.textContent = `${Minu.toString().padStart(2, "0")}:${Sec.toString().padStart(2, "0")}`;
}
export function setNbOfHearts(lifes) {
    const lifesElement = document.querySelector('.lifes span');
    lifesElement.textContent = lifes;
}
export function setScore(score) {
    const scoreElement = document.querySelector('.score span');
    scoreElement.textContent = score;
}