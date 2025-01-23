import { Enemy } from "./enemies.js";
import { gameState } from "./main.js";

export let enemiesCells = [];
export let gateCell = null;
const mapWidth = 15;
const mapHeight = 13;
const empty = 0;
const soft = 1;
const solid = 2;
const specialSolid = 3;
let softs = [];
export const enemies = [];
export const stuckEnemies = [];

function randomNumber() {
    return (Math.random() < 0.6) ? empty : soft
}

function stuckPosition(grid, i, j) {
    return (grid[i][j + 1] != 0 && grid[i][j - 1] != 0
        &&  grid[i + 1][j] != 0 && grid[i - 1][j] != 0)
}
    
function getRandomIndexes(grid) {
        const nums = new Set();
        while (nums.size < gameState.enimiesNumber) {
            const index = Math.floor(Math.random() * enemiesCells.length);
            const [i, j] = enemiesCells[index]
            if (!stuckPosition(grid, i, j)) nums.add(index);
        }
        return Array.from(nums);
}

function fixAxis(enemy) {
    if (enemy.axis == 'hor') {
        if (!enemy.passability.right && !enemy.passability.left) {
            enemy.axis = 'ver'
        }
    } else {
        if (!enemy.passability.top && !enemy.passability.bottom) {
            enemy.axis = 'hor'
        }   
    }
}

function addEnimies(grid) {
    const indexes = getRandomIndexes(grid);

    indexes.forEach((el) => {
        const [i, j] = enemiesCells[el];
        const enemy = new Enemy();
        enemy.create(i, j, grid);
        fixAxis(enemy);
        enemies.push(enemy);
    })
}

function mapGrid() {
    const grid = [];
    softs = [];
    for (let i = 0; i < mapHeight; i++) {
        grid[i] = [];
        for (let j = 0; j < mapWidth; j++) {

            if (i == 0 && j == 0 || i == mapHeight - 1 && j == 0 || j == mapWidth - 1 && i == 0 || j == mapWidth - 1 && i == mapHeight - 1) {
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
    gameState.player.setPlayerProperties(gameState.cellSize);

    enemiesCells = [];
    grid.forEach((row, i) => {
        row.forEach((el, j) => {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (el == specialSolid) {
                cell.classList.add('spSolid');
                cell.style.backgroundPosition = `${-2 * gameState.cellSize}px ${-(gameState.stage * gameState.cellSize)}px`;
            } else if (el == solid) {
                cell.classList.add('solid');
                cell.style.backgroundPosition = `0px ${-(gameState.stage * gameState.cellSize)}px`;
            } else if (el == soft) {
                cell.classList.add('soft');
                cell.style.backgroundPosition = `${-3 * gameState.cellSize}px ${-(gameState.stage * gameState.cellSize)}px`;
            } else {
                cell.classList.add('empty');
                cell.style.backgroundPosition = `${-1 * gameState.cellSize}px ${-(gameState.stage * gameState.cellSize)}px`;
                if (i >= 2 && j > 1 && (i + 1) % 2 == 0 && (j + 1) % 2 == 0) {
                    enemiesCells.push([i, j])
                }
            }

            cell.id = `cell${i}#${j}`;
            gameState.board.appendChild(cell)
        })
    });

    addEnimies(grid);
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