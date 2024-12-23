export const mapCells = {} // store theme whene they created and avoid quering DOM  evry time we need a cell
const mapWidth = 15;
const mapHeight = 13;
const empty = 0;
const soft = 1;
const solid = 2;
const randomNumber = () => (Math.random() < 0.6) ? empty : soft;

function mapGrid() {
    const grid = [];

    for (let i = 0; i < mapHeight; i++) {
        grid[i] = [];
        for (let j = 0; j < mapWidth; j++) {
            if (i == 0 || i == mapHeight - 1 || j == 0 || j == mapWidth - 1) {
                // corners
                grid[i][j] = solid;
            } else if (i == 1 && j == 1 || i == 1 && j == 2 || i == 2 && j == 1) {
                // ensure player right and bottom cells are empty 
                grid[i][j] = empty;
            } else if (i % 2 == 0 && j % 2 == 0) {
                // solide blocks inside the map
                grid[i][j] = solid;
            } else {
                // random blocks either soft or empty 
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
            if (el == solid) {
                cell.classList.add('solidWall')
            } else if (el == soft) {
                cell.classList.add('softWall')
            } else {
                cell.classList.add('empty')
            }

            cell.id = `cell${i}#${j}`
            mapCells[`cell${i}#${j}`] = cell;
            map.appendChild(cell)
        })
    });

    // player.updateNeighborCells(grid);
    player.updateBounds(grid);
    return grid;
}

