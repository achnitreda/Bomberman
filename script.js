const BOARD =  document.getElementById('board')
const PLAYER =  document.getElementById('player')
const GRID = []
const BOARD_WIDTH = 15;
const BOARD_HEIGHT = 13;
const SPEED = 2;
let position = {x: 0, y: 0}
let AnimationId = null;
let playerCell = {i: 1, j: 1}
let aroundPlayer = {left: {}, top: {}, right: {}, bottom: {}}



function randomNumber() {
    const random = Math.random();
    if (random < 0.6) {
        return 0;
    } else {
        return 1;
    }
}

for (let i = 0; i < BOARD_HEIGHT; i++) {
    GRID[i] = [];
    for (let j = 0; j < BOARD_WIDTH; j++) {
        if (i == 0 || i == BOARD_HEIGHT-1 || j == 0 || j == BOARD_WIDTH-1) {
            GRID[i][j] = 2;
        } else if (i == 1 && j == 1 || i == 1 && j == 2 || i == 2 && j == 1) {
            GRID[i][j] = 0;
        } else if (i % 2 == 0 && j % 2 == 0) {
            GRID[i][j] = 2;
        } else {
            GRID[i][j] = randomNumber()
        }
    }
    
}



GRID.forEach((row, i) => {
    row.forEach((el, j) => {
        const cell = document.createElement('div');
        cell.classList.add('cell')
        if (el == 2) {
            cell.classList.add('solidWall')
        } else if (el == 1) {
            cell.classList.add('softWall')
        } else {
            cell.classList.add('empty')
        }

        cell.id = `cell${i}${j}`
        BOARD.appendChild(cell)
    })
});

function initAroundPlayer() {
    const leftCell = document.getElementById(`cell${playerCell.i}${playerCell.j-1}`)
    const topCell = document.getElementById(`cell${playerCell.i-1}${playerCell.j}`)
    const rightCell = document.getElementById(`cell${playerCell.i}${playerCell.j+1}`)
    const bottomtCell = document.getElementById(`cell${playerCell.i+1}${playerCell.j}`)

    aroundPlayer.left.bound = leftCell.getBoundingClientRect().right;
    aroundPlayer.left.pass = GRID[playerCell.i][playerCell.j-1] != 2 && GRID[playerCell.i][playerCell.j-1] != 1;

    aroundPlayer.top.bound = topCell.getBoundingClientRect().bottom;
    aroundPlayer.top.pass = GRID[playerCell.i-1][playerCell.j] != 2 && GRID[playerCell.i][playerCell.j-1] != 1;

    aroundPlayer.right.bound = rightCell.getBoundingClientRect().left;
    aroundPlayer.right.pass = GRID[playerCell.i][playerCell.j+1] != 2 && GRID[playerCell.i][playerCell.j+1] != 1;

    aroundPlayer.bottom.bound = bottomtCell.getBoundingClientRect().top;
    aroundPlayer.bottom.pass = GRID[playerCell.i+1][playerCell.j] != 2 && GRID[playerCell.i][playerCell.j-1] != 1;

    console.log(rightCell, "\n", aroundPlayer.right.bound, "  ", aroundPlayer.right.pass);
    
}


initAroundPlayer() 

function move(direction) {
    if (direction == "ArrowRight") {
        if (PLAYER.getBoundingClientRect().right >= aroundPlayer.right.bound ) {
            if (aroundPlayer.right.pass) {
                position.x += SPEED;
            }
        } else {
            position.x += SPEED; 
        }
        
        if (PLAYER.getBoundingClientRect().left >= aroundPlayer.right.bound) {
            console.log('pass');
            
            playerCell.j++;
            initAroundPlayer();
        }
        
    } else if  (direction == "ArrowLeft") {
        position.x -= SPEED;
    } else if (direction == "ArrowUp") {
        position.y -= SPEED;
    } else {
        position.y += SPEED;
    }

    PLAYER.style.transform = `translate(${position.x}px, ${position.y}px)`
    AnimationId = requestAnimationFrame(() => move(direction))
}

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "ArrowDown") {
        if (!AnimationId) {
            AnimationId = requestAnimationFrame(() => move(e.key))
        }
    }
});

addEventListener("keyup", () => {
    cancelAnimationFrame(AnimationId);
    AnimationId = null
})