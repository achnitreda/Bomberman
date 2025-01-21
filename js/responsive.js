import { bomb } from "./bomb.js";
import { Enemy } from "./enemies.js";
import { enemies, enemiesIndexes } from "./map.js";

const MIN_CELL_SIZE = 32;
const MAX_CELL_SIZE = 64;

export function calcCellSize(stage) {
    if (!stage) stage = 0;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const availableWidth = windowWidth * 0.8;
    const availableHeight = windowHeight * 0.8;

    const cellByWidth = Math.floor(availableWidth / 15);
    const cellByHeight = Math.floor(availableHeight / 13);

    let cellSize = Math.min(cellByWidth, cellByHeight)

    cellSize = Math.max(MIN_CELL_SIZE, Math.min(cellSize, MAX_CELL_SIZE))

    document.documentElement.style.setProperty('--cellSize', `${cellSize}px`);
    document.documentElement.style.setProperty('--stage', `${stage}px`);

    return cellSize
}

const debounce = (func, wait = 0) => {
    let timeoutID
    return (...args) => {
        if (timeoutID) {
            clearTimeout(timeoutID);
        }
        timeoutID = setTimeout(() => {
            func(...args)
        }, wait)
    }
}

function setPositions(grid, stage, cellSize) {
    document.querySelector('.empty').forEach(el => console.log(el));
    



        grid.forEach((row) => {
        row.forEach((el) => {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (el == 3) {
                cell.style.backgroundPosition = `${-2*cellSize}px ${-(stage*cellSize)}px`;
            } else if (el == 2) {
                cell.style.backgroundPosition = `0px ${-(stage*cellSize)}px`;
            } else if (el == 1) {
                cell.style.backgroundPosition = `${-3*cellSize}px ${-(stage*cellSize)}px`;
            } else {
                cell.style.backgroundPosition = `${-1*cellSize}px ${-(stage*cellSize)}px`;
            }
        })
    });
}

export const handleResize = debounce((gameState) => {

    console.log(console.log(gameState.grid));
    

    enemies.forEach(enemy => {
        // console.log(enemy.cell)
        if (enemy.element && enemy.element.parentNode) {
            enemy.element.parentNode.removeChild(enemy.element);
        }
    });

    enemies.length = 0;

    gameState.cellSize = calcCellSize();
    setPositions(gameState.grid, gameState.stage, gameState.cellSize);


    enemiesIndexes.forEach(([i, j]) => {
        const enemy = new Enemy();
        enemy.create(i, j, gameState.grid);
        enemies.push(enemy);
    });

    gameState.player.setPlayerProperties(gameState.cellSize);
    gameState.player.updateBounds(gameState.grid, gameState.cellSize);

    if (bomb.exist) {
        bomb.updateSize(gameState.cellSize);
    }
}, 250);
