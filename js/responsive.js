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