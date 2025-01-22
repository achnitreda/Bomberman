import { gameState, gameLoop } from "./main.js";
import { handleResize } from "./responsive.js";
import { bomb } from "./bomb.js";
import { startNewStage } from "./gameProgress.js";

const pauseMenu = document.getElementById('pause-menu');
const continueBtn = document.getElementById('continue-btn');
const restartBtn = document.getElementById('restart-btn');

function togglePause() {
    if (gameState.gameWon || gameState.gameLost) return;

    gameState.isPaused = !gameState.isPaused;
    pauseMenu.classList.toggle('pausehidden');
    if (gameState.isPaused && bomb.exist) {
        clearTimeout(bomb.timerId);
    }

    if (!gameState.isPaused) {
        if (bomb.exist) {
            bomb.timerId = setTimeout(() => bomb.explode = true, 1500)
        }
        requestAnimationFrame(gameLoop);
    }
}

function restartGame() {
    location.reload();
}

export function setEvents() {
    // puse or contiue the game
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            togglePause();
        }
    });

    // restart or continue the game
    continueBtn.addEventListener('click', togglePause);
    restartBtn.addEventListener('click', restartGame);

    // handle resizing
    window.addEventListener('resize', () => handleResize(gameState));

    // place bomb
    document.addEventListener("keypress", e => {
        if (gameState.gameWon || gameState.gameLost) {
            return;
        }
    
        if (e.key.toLowerCase() == 'z') {
            if (!bomb.exist && gameState.player.alive) gameState.placeBomb = true;
        }
    })

    // player movement control 
    document.addEventListener("keydown", (e) => {
        if (gameState.gameWon || gameState.gameLost) {
            return;
        }
    
        if (e.key.startsWith('Arrow')) {
            if (!gameState.movementKeys.includes(e.key)) {
                gameState.movementKeys.unshift(e.key);
            }
        }
    })

    document.addEventListener("keyup", (e) => {
        if (gameState.gameWon || gameState.gameLost) {
            return;
        }
    
        if (e.key.startsWith('Arrow')) {
            gameState.movementKeys.splice(gameState.movementKeys.indexOf(e.key), 1)
        }
    })

    document.querySelector('#level-win button').addEventListener('click', () => {
        startNewStage();
        document.querySelector('.level-win').classList.add('hidden');
    })
}


