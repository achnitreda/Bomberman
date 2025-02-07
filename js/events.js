import { gameState } from "./main.js";
import { handleResize } from "./responsive.js";
import { bomb } from "./bomb.js";
import { startNewLevel } from "./gameProgress.js";
import { mapVisual, setNbOfHearts } from "./map.js";

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
    }
}

function restartGame() {
    location.reload()
}

export function setEvents() {
    // Pause/continue game
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            togglePause();
        }
    });

    // Game controls
    continueBtn.addEventListener('click', togglePause);
    restartBtn.addEventListener('click', restartGame);

    // Window resizing
    window.addEventListener('resize', () => handleResize(gameState));

    // Bomb placement
    document.addEventListener("keypress", e => {
        if (gameState.gameWon || gameState.gameLost || gameState.storyTime) {
            return;
        }
        if (e.key.toLowerCase() === 'z') {
            if (!bomb.exist && gameState.player.alive) gameState.placeBomb = true;
        }
    });

    // Player movement
    document.addEventListener("keydown", (e) => {
        if (gameState.gameWon || gameState.gameLost || gameState.storyTime) {
            return;
        }
        if (e.key.startsWith('Arrow')) {
            if (!gameState.movementKeys.includes(e.key)) {
                gameState.movementKeys.unshift(e.key);
            }
        }
    });

    document.addEventListener("keyup", (e) => {
        if (gameState.gameWon || gameState.gameLost || gameState.storyTime) {
            return;
        }
        if (e.key.startsWith('Arrow')) {
            gameState.movementKeys.splice(gameState.movementKeys.indexOf(e.key), 1);
        }
    });

     // Popup handlers
    document.querySelector('#stage1-win button').addEventListener('click', () => {
        startNewLevel();
        document.querySelector('#stage1-win').classList.add('hidden');
    });
    
    document.querySelector('#stage2-win button').addEventListener('click', () => {
        startNewLevel();
        document.querySelector('#stage2-win').classList.add('hidden');
    });

    document.getElementById('close-intro').addEventListener('click', () => {
        document.getElementById('intro-popup').classList.add('hidden');
        gameState.storyTime = false;
    });
      
    document.getElementById('start-btn').addEventListener('click', () => {
        document.getElementById('how-to-play').classList.add('hidden');
    });
}