

let rows = 0;
let columns = 0;
let position = 0;
let numberOfEmptyCells = 1;
let size = 100;
let backgroundColor = "#314b3e";
let gridColor = "#314b3e";
let borderColor = "#ffffff";

let transitionSpeed = 500;

let startupShuffleToggle = false;
let effect1 = true;
let effect2 = true;

const TOTAL_SETTINGS = 24;
let loadCount = 0;
function livelyPropertyListener(name, value) {
    switch (name) {

        case"rows":
            rows = value;
            gridAreaConfig();
            break;
        case"columns":
            columns = value;
            gridAreaConfig();
            break;
        case"emptyCells":
            emptyCellsConfig(value);
            gridAreaConfig();
            break;
            
        case"bgColor":
            document.body.style.backgroundColor = value;
            break;
        case"gridColor":
            grid.grid.style.backgroundColor = value;
            break;
        case"gridPosition":
            position = value;
            gridPositionConfig();
            break;
        case"gridSize":
            size = value;
            gridSizeConfig();
            break;

        case"movementCurve":
            movementCurveConfig(value);
            break;
        case"animationToggle1":
            effect1 = value;
            effectToggleConfig();
            break
        case"animation1":
            animIndex1 = value;
            break;
        case"animationToggle2":
            effect2 = value;
            effectToggleConfig();
            break
        case"animation2":
            animIndex2 = value;
            break;

        case"animationIntensity":
            document.body.style.setProperty('--effectIntensity', `${value}`);
            break;
        case"animationColor":
            document.body.style.setProperty('--effectColor', `${value}`);
            break;
            
        case"borderRadius":
            borderRadiusConfig(value);
            break;
        case"cellGap":
            gapConfig(value);
            break;
        case"colorMode":
            colorMode = value;
            reloadCells();
            break;
        case"color1":
            colors[0] = value;
            reloadCells();
            break;
        case"color2":
            colors[1] = value;
            reloadCells();
            break;

        case"ticks":
            ticksConfig(value);
            break;
        case"interval":
            intervalConfig(value);
            break;
        case"transitionSpeed":
            transitionSpeedConfig(value);
            break;
        case"shuffle": //! NOT INCLUDED IN COUNT
            triggerTicks(startupShuffle);
            break;
        case"startupShuffle":
            startupShuffleToggle = value;
            break;
        case"shuffleAmount":
            startupShuffle = value;
            break;
        default: break;
    }
    loadCount++;
    if (loadCount == TOTAL_SETTINGS) {
        if (startupShuffleToggle) triggerTicks(startupShuffle); 
    }
}

function gapConfig(value) {
    const final = grid.cellHeight * value;
    document.body.style.setProperty('--gap', `${final}px`);
    updateCells();
}

function effectToggleConfig() {
    effectToggle1 = effect1;
    effectToggle2 = effect2;
}

function reloadCells() {
    clearCells();
    fillSpace(numberOfEmptyCells);
}

function gridAreaConfig() {
    clearCells();
    grid.setGridArea(rows, columns);
    if(numberOfEmptyCells >= (rows*columns)) {
        fillSpace((rows*columns) - 1);
        return;
    }
    fillSpace(numberOfEmptyCells);
}

function gridSizeConfig() {
    grid.setSize(size);
    updateCells();
}

function gridPositionConfig() {
    grid.setPosition(position);
    updateCells();
}

function gridColorConfig() {
    grid.style.backgroundColor = gridColor;
}

function emptyCellsConfig(value) {
    if (value > ((rows*columns))) return;
    numberOfEmptyCells = value;
}

function bgColorConfig() {
    document.body.style.backgroundColor = backgroundColor;
}

function movementCurveConfig(value) {
    const curve = ['linear', 'ease-in', 'ease-out', 'ease-in-out'];
    document.body.style.setProperty('--transitionTiming', curve[value]);
}

function borderRadiusConfig(value) {
    document.body.style.setProperty('--borderRadius', `${value}`)
}

function ticksConfig(value) {
    numberOfTicks = value;
    stopLoop();
    startLoop();
}

function intervalConfig(value) {
    interval = value;
    stopLoop();
    startLoop();
}

function transitionSpeedConfig(value) {
    transitionSpeed = value;
    document.body.style.setProperty('--transitionSpeed', `${transitionSpeed}`);
}