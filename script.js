const board =  document.getElementById('board')
const player =  document.getElementById('player')
let grid = []



function randomNumber() {
    const random = Math.random();
    if (random < 0.2) {
        return 0;
    } else if (random < 0.55) {
        return 1;
    } else {
        return 2;
    }
}

for (let i = 0; i < 13; i++) {
    grid[i] = [];
    for (let j = 0; j < 15; j++) {
        if (i == 0 || i == 12 || j == 0 || j == 14) {
            grid[i][j] = 0;
        } else if (i == 1 && j == 1 || i == 1 && j == 2 || i == 2 && j == 1) {
            grid[i][j] = 2;
        } else {
            grid[i][j] = randomNumber()
        }
    }
    
}

grid.forEach(row => {
    row.forEach(el => {
        const cell = document.createElement('div');
        cell.classList.add('cell')
        if (el == 0) {
            cell.id = 'solidWall'
        } else if (el == 1) {
            cell.id = 'softWall'
        } else {
            cell.id = 'empty'
        }

        board.appendChild(cell)
    })
});


document.addEventListener("keydown", (e) => {
    // console.log(player.style.left.length);
    
    let currentLeft = parseInt(player.style.left || 65);
    let currentTop = parseInt(player.style.top || 65);

    if (e.key === "ArrowRight") {
        player.style.left = `${currentLeft + 2}px`;
    } else if (e.key === "ArrowLeft") {
        player.style.left = `${currentLeft - 2}px`;
    } else if (e.key === "ArrowUp") {
        player.style.top = `${currentTop - 2}px`;
    } else if (e.key === "ArrowDown") {
        player.style.top = `${currentTop + 2}px`;
    }
});