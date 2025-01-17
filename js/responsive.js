import { bomb } from "./bomb.js";
import { Enemy, enimiesNumber } from "./enemies.js";
import { enemies, enemiesCells } from "./map.js";

export function calcCellSize() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const availableWidth = windowWidth * 0.8;
    const availableHeight = windowHeight * 0.8;

    const cellByWidth = Math.floor(availableWidth / 15);
    const cellByHeight = Math.floor(availableHeight / 13);

    const cellSize = Math.min(cellByWidth, cellByHeight)

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

export const handleResize = debounce((gameState) => {
    enemies.forEach(enemy => {
        if (enemy.element && enemy.element.parentNode) {
            enemy.element.parentNode.removeChild(enemy.element);
        }
    });

    enemies.length = 0;

    gameState.cellSize = calcCellSize();

    const selectedCells = enemiesCells.slice(0, enimiesNumber);

    selectedCells.forEach(([i, j]) => {
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
