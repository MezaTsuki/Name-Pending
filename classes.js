
function hexToRgbArray(hex) {
    hex = hex.replace('#','');
    return [
        parseInt(hex.slice(0,2), 16),
        parseInt(hex.slice(2,4), 16),
        parseInt(hex.slice(4,6), 16)
    ];
}
function getGradient(color1, color2, iteration, max) {
    max--;
    color1 = hexToRgbArray(color1);
    color2 = hexToRgbArray(color2);

    let gradient = color1.map((col1, i) => {
        return col1 + ((color2[i] - col1) / max) * iteration;
    })
    gradient = gradient.map(val => {
        return Math.round(val).toString(16).padStart(2, "0");
    });
    return "#" + gradient[0] + gradient[1] + gradient[2];
}
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomHex() {
    return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
}

/**todo: Features to Add
 *      
 *      1. Add README
 *      2. Chopped image sections for Cell backgrounds
 *      3. -
 *      4. -
 *      5. -
 */

let grid;
let cells = [];
let cellCount = 0;
let blockedCount = 0;
class Grid {
    constructor(grid) {
        const gridStyle = getComputedStyle(grid);
        const rect = grid.getBoundingClientRect();

        this.height = rect.height;
        this.width = rect.width;

        this.x = rect.left;
        this.y = rect.top;
        this.rows = parseInt(gridStyle.getPropertyValue('--rows'));
        this.columns = parseInt(gridStyle.getPropertyValue('--columns'));

        this.cellHeight = this.height / this.rows;
        this.cellWidth = this.width / this.columns;

        this.grid = grid;
        this.emptyCells = [];
        this.fieldData = Array.from(
            { length: this.rows }, 
            () => Array(this.columns).fill(0)
        );

        // console.log("grid constructed");
    }

    //! __ SET / UPDATE
    updateDimensions() {
        const rect = this.grid.getBoundingClientRect();
        this.height = rect.height;
        this.width = rect.width;
        this.x = rect.left;
        this.y = rect.top;
        this.cellHeight = this.height / this.rows;
        this.cellWidth = this.width / this.columns;
    }
    setGridArea(rows, columns) {
        this.grid.style.setProperty('--rows', `${rows}`);
        this.grid.style.setProperty('--columns', `${columns}`);
        this.rows = rows;
        this.columns = columns;
        this.updateDimensions();
        this.emptyCells = [];
        this.fieldData = Array.from(
            { length: this.rows },
            () => Array(this.columns).fill(0)
        );
    }
    setSize(size) {
        this.grid.style.height = `${size}vh`;
        this.updateDimensions();
    }
    setPosition(pos) {
        const body = document.body;
        switch(pos){
            case 0: //! Center
                body.style.justifyContent = "center";
                body.style.alignItems = "center";
                break;
            case 1: //! Top
                body.style.justifyContent = "center";
                body.style.alignItems = "flex-start";
                break;
            case 2: //! Left
                body.style.justifyContent = "flex-start";
                body.style.alignItems = "center";
                break;
            case 3: //! Right
                body.style.justifyContent = "flex-end";
                body.style.alignItems = "center";
                break;
            case 4: //! Bottom
                body.style.justifyContent = "center";
                body.style.alignItems = "flex-end";
                break;
            case 5: //! Top Left
                body.style.justifyContent = "flex-start";
                body.style.alignItems = "flex-start";
                break;
            case 6: //! Top Right
                body.style.justifyContent = "flex-end";
                body.style.alignItems = "flex-start";
                break;
            case 7: //! Bottom Left
                body.style.justifyContent = "flex-start";
                body.style.alignItems = "flex-end";
                break;
            case 8: //! Bottom Right
                body.style.justifyContent = "flex-end";
                body.style.alignItems = "flex-end";
                break;
            default: break;
        }
        this.updateDimensions();
    }

    //! __ FIELD DATA
    clearData() {
        for (let r = 0; r < this.rows; r++) {
            this.fieldData[r].fill(0);
        }
    }
    addOccupiedSpace(row, column) {
        this.fieldData[row][column] = 1;
        const index = this.emptyCells.findIndex(el => 
            el.row == row && el.column == column
        );
        if (index !== -1) {
            this.emptyCells.splice(index, 1);
        }
    }
    addEmptySpace(row, column) {
        this.fieldData[row][column] = 0;
        this.emptyCells.push({ row: row, column: column});
    }
    addBlockedSpace(row, column) {
        this.fieldData[row][column] = 2;
    } //! CHANGED

    //? DEBUG
    printFieldData() {
       console.table(this.fieldData);
       console.table(this.emptyCells);
    }
}
function initGrid() {
    grid = new Grid(document.querySelector('.grid'));
}
function clearCells() {
    cells.forEach(row => {
    row.forEach(cell => {
        if (cell) cell.destroy();
    })
    });
    cells = [];
    cellCount = 0;
    grid.emptyCells = [];
}
function updateCells() {
    cells.forEach(row => {
    row.forEach(cell => {
        if(cell) cell.update();
    })
    })
}
function fillSpace(numberOfEmptyCells) {
    const totalCells = (grid.rows * grid.columns);
    const fillEnd = totalCells - numberOfEmptyCells - blockedCount;

    let i = 0; 
    for(row = 0; row < grid.rows; row++) {
        cells[row] = []; 
    for(column = 0; column < grid.columns; ++column) {
        if (grid.fieldData[row][column] == 2) { 
            continue; //! CHANGED
        }
        else if (i >= fillEnd) {
            grid.addEmptySpace(row, column);
            cells[row][column] = null;
        } else {
            cells[row][column] = new Cell(grid, row, column, colorConfig(i, fillEnd));
            cellCount++;
        }
        ++i;
    }}
}
function colorConfig(iteration, numberOfCells) {
    switch(colorMode) {
        case 0: //! Single
            return colors[0];
        case 1: //!Gradient
            return getGradient(colors[0], colors[1], iteration, numberOfCells);
        case 2: //! Random
            return randomHex();
        default: break;
    }
}


let colorMode = 1;
let colors = ["#5dcce7", "#F7C347"];
class Cell {
    constructor(parent, row, column, color) {
        this.row = row;
        this.column = column;
        this.Parent = parent;

        this.gap = parseFloat(getComputedStyle(document.body).getPropertyValue('--gap'));
        this.cell = document.createElement('div');
        this.cell.classList.add('square');
        this.cell.style.height = `${this.Parent.cellHeight - this.gap}px`;
        this.cell.style.width = `${this.Parent.cellWidth - this.gap}px`;
        this.cell.style.top = `${this.Parent.y + (this.Parent.cellHeight * this.row) + (this.gap/2)}px`;
        this.cell.style.left = `${this.Parent.x + (this.Parent.cellWidth * this.column) + (this.gap/2)}px`;
        this.cell.style.background = `${color}`;
        document.body.appendChild(this.cell);

        this.Parent.addOccupiedSpace(row, column);
        // console.log("cell constructed");
    }
    destroy() {
        this.Parent.addEmptySpace(this.row, this.column);
        this.Parent = null;
        this.cell.remove();
        this.cell = null;
    }
    update() {
        this.gap = parseFloat(getComputedStyle(document.body).getPropertyValue('--gap'));
        this.cell.style.height = `${this.Parent.cellHeight - this.gap}px`;
        this.cell.style.width = `${this.Parent.cellWidth - this.gap}px`;
        this.cell.style.top = `${this.Parent.y + (this.Parent.cellHeight * this.row) + (this.gap/2)}px`;
        this.cell.style.left = `${this.Parent.x + (this.Parent.cellWidth * this.column) + (this.gap/2)}px`;
    }
    
    move(newRow, newColumn) {
        if (effectToggle1) {
            const effect = new Effect(this, animIndex1, this.row, this.column, newRow, newColumn);
            effect.play();
        }
        if (effectToggle2) {
            const effect = new Effect(this, animIndex2, this.row, this.column, newRow, newColumn);
            effect.play();
        }
        this.Parent.addEmptySpace(this.row, this.column);
        this.row = newRow;
        this.column = newColumn
        this.cell.style.height = `${this.Parent.cellHeight - this.gap}px`;
        this.cell.style.width = `${this.Parent.cellWidth - this.gap}px`;
        this.cell.style.top = `${this.Parent.y + (this.Parent.cellHeight * newRow) + (this.gap/2)}px`;
        this.cell.style.left = `${this.Parent.x + (this.Parent.cellWidth * newColumn) + (this.gap/2)}px`;
        this.Parent.addOccupiedSpace(this.row, this.column);
    }
}

let effectToggle1 = true;
let effectToggle2 = true;
const animName = [
    "effect-impact", "effect-shockwave", "extend", "shrink", "flash", "flash"
];
const animType = [
    4, 4, 1, 1, 0, 1
];
let animIndex1 = 1;
let animIndex2 = 4;
class Effect {
    constructor(cell, index, fromRow, fromCol, toRow, toCol){
        const globalCSSProperties = getComputedStyle(document.body);
        this.cell = cell.cell;
        this.animIndex = index;
        this.cellStyle = getComputedStyle(this.cell);
        this.dirIndex = directionCheck(fromRow, fromCol, toRow, toCol);
        //? _________  [top], [right], [bottom], [left]

        this.transitionDuration = parseFloat( globalCSSProperties.getPropertyValue('--transitionSpeed') );
        //! ms
    }
    destroy() {
        this.cell = null;
        this.cellStyle = null;
        this.animIndex = null;
        this.dirIndex = null;
        this.transitionDuration = null;
    }
    play() {
        switch(animType[this.animIndex]) {
            case 0: this.mutative_end(); break;
            case 1: this.mutative_start(); break;

            case 2: this.generative_end(); break;
            case 3: this.generative_start(); break;

            case 4: this.directional_end(); break;
            case 5: this.directional_start(); break;
            default: break;
        }
    }
    mutative_end() {
        const dir = ['top', 'right', 'bottom', 'left']
        const name = animName[this.animIndex] + "-" + dir[this.dirIndex];
        const duration = parseFloat(this.cellStyle.transitionDuration) * 1000;
        // console.log(duration);
        setTimeout(() => {
            this.cell.style.animation = `${name} ${duration}ms var(--transitionTiming)`;
            setTimeout(() => { this.cell.style.animation = ""; this.destroy(); }, (duration - 10))
        }, (duration - 10))
    }
    mutative_start() {
        const dir = ['top', 'right', 'bottom', 'left']
        const name = animName[this.animIndex] + "-" + dir[this.dirIndex];
        const duration = parseFloat(this.cellStyle.transitionDuration) * 1000;
        this.cell.style.animation = `${name} ${duration}ms var(--transitionTiming)`;
        setTimeout(() => { this.cell.style.animation = ""; this.destroy(); }, (duration - 10))
    }
    generative_end() {
   
    }
    generative_start() {
   
    }
    directional_end() {
        setTimeout(() => {
            const effect = document.createElement('div');
            effect.classList.add(`${animName[this.animIndex]}`);

            const container = document.createElement('div');
            container.classList.add('dir-body');
            container.style.height = this.cell.style.height;
            container.style.width = this.cell.style.width;
            container.style.top = this.cell.style.top;
            container.style.left = this.cell.style.left;
            container.style.transform = `rotate(${90 * this.dirIndex}deg)`;
            container.appendChild(effect);

            document.body.appendChild(container); 
            const effectDuraton = parseFloat(getComputedStyle(effect).animationDuration) * 1000;
            setTimeout(() => { container.remove(); this.destroy(); }, effectDuraton - 20);
            // console.log("PLAY");

        }, this.transitionDuration)
    }
    directional_start() {

    }
}
function directionCheck(fromRow, fromCol, toRow, toCol) {
    const direction = [[-1, 0], [0, 1], [1, 0], [0, -1]];
    //? _________  [up], [right], [down], [left]

    return direction.findIndex(([row, col]) => {
        const dirRow = fromRow + row;
        const dirCol = fromCol + col;
        return (dirRow == toRow) && (dirCol == toCol);
    })
}