const mapWidth = 15;
const mapHeight = 13;
const randomNumber = () => (Math.random() < 0.6) ? 0 : 1;

function mapGrid() {
    const grid = [];

    for (let i = 0; i < mapHeight; i++) {
        grid[i] = [];
        for (let j = 0; j < mapWidth; j++) {
            if (i == 0 || i == mapHeight - 1 || j == 0 || j == mapWidth - 1) {
                grid[i][j] = 2;
            } else if (i == 1 && j == 1 || i == 1 && j == 2 || i == 2 && j == 1) {
                grid[i][j] = 0;
            } else if (i % 2 == 0 && j % 2 == 0) {
                grid[i][j] = 2;
            } else {
                grid[i][j] = randomNumber();
            }
        }
    }

    return grid;
}

export function mapVisual(map, player) {
    const grid = mapGrid();
    grid.forEach((row, i) => {
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
            // if (i == 1 && j == 1) {
            //     const player = document.createElement('div');
            //     player.id = "player"
            //     cell.appendChild(player)
            // }
            map.appendChild(cell)
        })
    });

    player.updateBounds(grid);
    return grid;
}

