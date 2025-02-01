import { bomb } from "./bomb.js";
import { player } from "./player.js";

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

function adaptPOsitions(level, cellSize) {
    [...document.getElementsByClassName('empty')].forEach(cell => {
        cell.style.backgroundPosition = `${-1*cellSize}px ${-(level*cellSize)}px`;
    });

    [...document.getElementsByClassName('soft')].forEach(cell => {
        cell.style.backgroundPosition = `${-3*cellSize}px ${-(level*cellSize)}px`;
    });

    [...document.getElementsByClassName('solid')].forEach(cell => {
        cell.style.backgroundPosition = `0px ${-(level*cellSize)}px`;
    });

    [...document.getElementsByClassName('spSolid')].forEach(cell => {
        cell.style.backgroundPosition = `${-2*cellSize}px ${-(level*cellSize)}px`;
    });
}

export const handleResize = debounce((gameState) => {
    const i = Math.trunc((player.position.y + (player.size*0.5)) / gameState.cellSize);
    const j = Math.trunc((player.position.x + (player.size*0.5)) / gameState.cellSize);
    gameState.cellSize = calcCellSize();

    
    //adapte the new backround position for each cell to match the new cell size
    adaptPOsitions(gameState.level, gameState.cellSize);

    // reset enemies propertise to much the new sizes
    gameState.enemies.forEach((enemy) => {
        enemy.setEnemyProperties(gameState.cellSize);
    });
    
    gameState.player.setProperties(gameState.cellSize, i, j);

    if (bomb.exist) {
        bomb.updateSize(gameState.cellSize);
    }
}, 250);
