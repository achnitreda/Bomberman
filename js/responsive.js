import { bomb } from "./bomb.js";
import { enemies } from "./map.js";

const MIN_CELL_SIZE = 24;
const MAX_CELL_SIZE = 56;

export function calcCellSize() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const availableWidth = windowWidth * 0.8;
    const availableHeight = windowHeight * 0.8;

    const cellByWidth = Math.floor(availableWidth / 15);
    const cellByHeight = Math.floor(availableHeight / 13);

    let cellSize = Math.min(cellByWidth, cellByHeight);

    cellSize = Math.max(MIN_CELL_SIZE, Math.min(cellSize, MAX_CELL_SIZE))

    document.documentElement.style.setProperty('--cellSize', `${cellSize}px`);

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

function adaptPOsitions(stage, cellSize) {
    [...document.getElementsByClassName('empty')].forEach(cell => {
        cell.style.backgroundPosition = `${-1*cellSize}px ${-(stage*cellSize)}px`;
    });

    [...document.getElementsByClassName('soft')].forEach(cell => {
        cell.style.backgroundPosition = `${-3*cellSize}px ${-(stage*cellSize)}px`;
    });

    [...document.getElementsByClassName('solid')].forEach(cell => {
        cell.style.backgroundPosition = `0px ${-(stage*cellSize)}px`;
    });

    [...document.getElementsByClassName('spSolid')].forEach(cell => {
        cell.style.backgroundPosition = `${-2*cellSize}px ${-(stage*cellSize)}px`;
    });
}

export const handleResize = debounce((gameState) => {
    gameState.cellSize = calcCellSize();
    
    
    //adapte the new backround position for each cell to match the new cell size
    adaptPOsitions(gameState.stage, gameState.cellSize);

    // reset enemies propertise to much the new sizes
    enemies.forEach((enemy) => {
        enemy.setEnemyProperties(gameState.cellSize);
        enemy.updateBounds(gameState.grid);
    });

    gameState.player.setPlayerProperties(gameState.cellSize);
    gameState.player.updateBounds(gameState.grid, gameState.cellSize);

    if (bomb.exist) {
        bomb.updateSize(gameState.cellSize);
    }
}, 250);
