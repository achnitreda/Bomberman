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
const logo = {
    element: document.getElementById('logo'),
    dir: 1,
}

export function logoMove() {
    logo.element.style.transform = `translate(${logo.dir*.1}px, 0px)`;
    logo.dir *= -1;
}

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
            const index = Math.trunc(Math.random() * enemiesCells.length);
            const [i, j] = enemiesCells[index]
            if (!stuckPosition(grid, i, j)) nums.add(index);
        }
        return Array.from(nums);
}

function fixAxis(enemy, grid) {
    if (enemy.axis == 'hor') {
        if (grid[enemy.initCell.i][enemy.initCell.j+1] != 0 && grid[enemy.initCell.i][enemy.initCell.j-1] != 0) {
            enemy.axis = 'ver';
        }
    } else {
        if (grid[enemy.initCell.i+1][enemy.initCell.j] != 0 && grid[enemy.initCell.i-1][enemy.initCell.j] != 0) {
            enemy.axis = 'hor';
        }   
    }
}

function addEnimies(grid) {
    const indexes = getRandomIndexes(grid);
    indexes.forEach((el) => {
        const [i, j] = enemiesCells[el];
        const enemy = new Enemy();
        enemy.create(i, j, grid);
        fixAxis(enemy, grid);
        gameState.enemies.push(enemy);
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
    gateCell = softs[Math.trunc(Math.random() * softs.length)];
    console.log(gateCell);
    
    return grid;
}

export function mapVisual() {
    const grid = mapGrid();
    gameState.player.setProperties(gameState.cellSize, 1, 1);

    enemiesCells = [];
    grid.forEach((row, i) => {
        row.forEach((el, j) => {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (el == specialSolid) {
                cell.classList.add('spSolid');
                cell.style.backgroundPosition = `${-2 * gameState.cellSize}px ${-(gameState.level * gameState.cellSize)}px`;
            } else if (el == solid) {
                cell.classList.add('solid');
                cell.style.backgroundPosition = `0px ${-(gameState.level * gameState.cellSize)}px`;
            } else if (el == soft) {
                cell.classList.add('soft');
                cell.style.backgroundPosition = `${-3 * gameState.cellSize}px ${-(gameState.level * gameState.cellSize)}px`;
            } else {
                cell.classList.add('empty');
                cell.style.backgroundPosition = `${-1 * gameState.cellSize}px ${-(gameState.level * gameState.cellSize)}px`;
                if (i >= 2 && j > 1 && (i + 1) % 2 == 0 && (j + 1) % 2 == 0) {
                    enemiesCells.push([i, j])
                }
            }

            cell.id = `cell${i}#${j}`;
            gameState.board.appendChild(cell)
        })
    });

    addEnimies(grid);

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