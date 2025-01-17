import { bomb } from "./bomb.js";
import { enemies } from "./map.js";

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
    gameState.cellSize = calcCellSize()
    gameState.player.setPlayerProperties(gameState.cellSize);
    gameState.player.updateBounds(gameState.grid, gameState.cellSize)
    console.log("cellSize ->", gameState.cellSize)

    if (enemies.length > 0) {
        enemies.forEach(enemy => {
            enemy.updateSize(gameState.cellSize)
            // enemy.updateBounds(gameState.grid)
        })
    }

    if (bomb.exist) {
        bomb.updateSize(gameState.cellSize);
    }

}, 250)
