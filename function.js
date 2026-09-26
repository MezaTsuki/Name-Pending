

document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
        // console.log("Lively wallpaper paused");
        stopLoop();
    } else if (document.visibilityState === "visible") {
        // console.log("Lively wallpaper resumed");
        startLoop();
    }
});

initGrid(); //! MOST IMPORTANT PART

//? __ WEB DEBUG
document.addEventListener('DOMContentLoaded', () => {
    // grid.setGridArea(3, 3); console.table(grid.fieldData);
    // grid.setPosition(0);
    // grid.setSize(100);
    // fillSpace(4);
    // startLoop();
    // triggerTicks(100);
});


//# __ LOOP __
let interval = 1010;
let startupShuffle = 200;
let numberOfTicks = 1;

const movement = ['up', 'down', 'left', 'right']
const direction = [[1, 0], [-1, 0], [0, 1], [0, -1]];
//? _________  [up], [down], [left], [right] 
let dirIndex = [];
let loop;
function startLoop() {
    stopLoop();
    loop = setInterval(() => { tick(numberOfTicks); }, interval);
}
function stopLoop() {
    if (loop !== null) {
        clearInterval(loop);
        loop = null;
    }
}
function tick(times = 1) {
    let safety = 0;
    let previousCells = [];
    while(times > 0) {
        times--;
    let nothingMoved = true;
    while(nothingMoved){
        if(safety++ > 15) break;

        const randomEmptyCell = grid.emptyCells[random(0, grid.emptyCells.length - 1)];
        const availableCells = checkAvailableCells(randomEmptyCell);

        if (availableCells.length <= 0) continue;
        const chosenCell = availableCells[random(0, availableCells.length - 1)];
        const cellRow = chosenCell.row;
        const cellCol = chosenCell.column;
        const emptyRow = randomEmptyCell.row;
        const emptyCol = randomEmptyCell.column;

        // console.log(`empty: ${emptyRow} ${emptyCol}`);
        // console.log(`chosen: ${cellRow} ${cellCol}`);

        const chosenCellObj = cells[cellRow][cellCol];
        if (previousCells.length >= cellCount-1) {
            previousCells = []; 
            // console.log("___________CLEARED");
        }
        if (previousCells.includes(chosenCellObj)) continue;

        nothingMoved = false;
        chosenCellObj.move(emptyRow, emptyCol);
        cells[emptyRow][emptyCol] = chosenCellObj;
        cells[cellRow][cellCol] = null;
        previousCells.push(chosenCellObj);
    }}
    // console.log("Safety: " + safety);
    // console.log("previousCount: "+previousCells.length);
    // console.log("cellCount: "+cellCount);
}
function checkAvailableCells(emptyCell) {
    //? Checks available cells [1] based on empty space [0]
    let result = [];
    dirIndex = [];
    let i = 0;

    direction.forEach(([r, c]) => {
        const dirY = emptyCell.row + r;
        const dirX = emptyCell.column + c;
        if (dirY >= 0 && dirY < grid.rows && dirX >=0 && dirX < grid.columns) {
        if (grid.fieldData[dirY]?.[dirX] === 1) {
            result.push({ row: dirY, column: dirX });
            dirIndex.push(i);
            // console.log(dirY, dirX);
        }} i++;
    })
    return result;
}

window.stopLoop = stopLoop;
window.startLoop = startLoop;

let ready = true;
async function triggerTicks(times) {
    if (!ready) return;
    ready = false;
    stopLoop();
    
    await new Promise(r => setTimeout(r, interval));
    document.body.style.setProperty('--transitionSpeed', `${0}`);
    effectToggle1 = false; effectToggle2 = false;
    for(let i=0; i<times; i++) {
        tick(numberOfTicks);
        await new Promise(r => setTimeout(r, 5));
    }

    setTimeout(() => {
        document.body.style.setProperty('--transitionSpeed', `${transitionSpeed}`);
        effectToggleConfig();
        startLoop();
        ready = true;
    }, interval)
}


