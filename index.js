const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';
const MAX_FIELD_SIZE = 10;

const container = document.getElementById('fieldWrapper');
let fieldSize = 3;
let field = Array.from({ length: fieldSize }).map(
    () => Array.from({ length: fieldSize }).map(() => EMPTY)
)
let turn = CROSS;
let moveCount = 0;
let isGameEnded = false;

let numberInput = document.querySelector('#field-size');
numberInput.value = fieldSize;
numberInput.addEventListener('change', (evt) => {
    fieldSize = parseInt(evt.currentTarget.value);
    console.log(`New field size is: ${fieldSize}`);
    resetClickHandler();
});

let gameMode = {
    'random-bot': makeRandomMove,
    'smart-bot': makeSmartMove,
    'hot-seat': () => {}
}

let makeCurrentGameMove = gameMode['random-bot'];

initializeGameModes();
startGame();
addResetListener();

function initializeGameModes() {
    let gameModeOptionElement = document.querySelector('#game-mode');

    for (let modeName of Object.keys(gameMode)) {
        let newOption = document.createElement('option');
        newOption.value = modeName;
        newOption.innerHTML = modeName;
        gameModeOptionElement.appendChild(newOption);
    }

    gameModeOptionElement.addEventListener('change', (evt) => {
        let newMode = evt.currentTarget.value;
        console.log(`New game mode is: ${newMode}`);
        makeCurrentGameMove = gameMode[newMode];
        resetClickHandler();
    })
}

function startGame() {
    renderGrid(fieldSize);
}

function renderGrid() {
    container.innerHTML = '';

    for (let i = 0; i < fieldSize; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < fieldSize; j++) {
            const cell = document.createElement('td');
            cell.textContent = field[i][j];
            cell.addEventListener('click', () => cellClickHandler(i, j));
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}

function checkOnWin(line) {
    return (
        line.every((cell) => cell === CROSS) || 
        line.every((cell) => cell === ZERO)
    )
}

function checkGameEnd() {
    for (let i = 0; i < fieldSize; i++) {
        let row = field[i];
        if (checkOnWin(row)) {
            return [
                row[0],
                new Array(fieldSize).fill([]).map((_, idx) => [i, idx])
            ];
        } 
        
        let col = field.map((row) => row[i]).flat();
        if (checkOnWin(col)) {
            return [
                col[0],
                new Array(fieldSize).fill([]).map((_, idx) => [idx, i])
            ];
        }
    }

    let diag = field.map((row, idx) => row[idx]).flat();
    if (checkOnWin(diag)) {
        return [
            diag[0],
            new Array(fieldSize).fill([]).map((_, idx) => [idx, idx])
        ];
    }

    diag = field.map((row, idx) => row[fieldSize - 1 - idx]).flat();
    if (checkOnWin(diag)) {
        return [
            diag[0],
            Array.from({ length: fieldSize }).map((_, idx) => [idx, fieldSize - 1 - idx])
        ]
    }
 
    return null;
}

function isFull() {
    return moveCount === fieldSize * fieldSize;
}

function makeRandomMove() {
    let emptyCells = field
        .map((row, rowIdx) => (
            row.map((row, cellIdx) => row === EMPTY ? [rowIdx, cellIdx] : null)
        ))
        .flatMap((row) => row)
        .filter((coords) => coords !== null);
    
    let randomIdx = Math.floor(Math.random() * emptyCells.length);
    let [row, col] = emptyCells[randomIdx];

    makeMove(row, col);
}

function minmax(depth, isMaximizing, alpha, beta, maxDepth) {
    let gameEnd = checkGameEnd();
    let winner = gameEnd ? gameEnd[0] : "";

    switch (winner) {
        case CROSS:
            return 10 - depth;
        case ZERO:
            return depth - 10;
    }

    if (isFull() || depth === maxDepth) {
        return 0;
    }

    let best = isMaximizing ? -Infinity : Infinity;
    const symbol = isMaximizing ? CROSS : ZERO;

    for (let i = 0; i < fieldSize; i++) {
        for (let j = 0; j < fieldSize; j++) {
            if (field[i][j] === EMPTY) {
                field[i][j] = symbol;
                const score = minmax(depth + 1, !isMaximizing, alpha, beta, maxDepth);
                field[i][j] = EMPTY;
                
                if (isMaximizing) {
                    best = Math.max(best, score);
                    alpha = Math.max(alpha, score);
                } else {
                    best = Math.min(best, score);
                    beta = Math.min(beta, score);
                }

                if (beta <= alpha) {
                    break;
                }
            }
        }
    }

    return best;
}

function findBestMove() {
    let bestScore = -Infinity;
    let move = null;

    for (let i = 0; i < fieldSize; i++) {
        for (let j = 0; j < fieldSize; j++) {
            if (field[i][j] === EMPTY) {
                field[i][j] = CROSS;
                const score = minmax(0, false, -Infinity, Infinity, 2);
                field[i][j] = EMPTY;
                if (score > bestScore) {
                    bestScore = score;
                    move = [i, j]
                }
            }
        }
    }

    return move;
}

function makeSmartMove() {
    let [row, col] = findBestMove();
    makeMove(row, col);
}

function paintCells(symbol, cells) {
    for (let cell of cells) {
        let [row, col] = cell;
        renderSymbolInCell(symbol, row, col, 'red');
    }
}

function cellClickHandler(row, col) {
    makeMove(row, col);
    makeCurrentGameMove();
}

function makeMove(row, col) {
    if (field[row][col] !== EMPTY || isGameEnded) {
        return;
    }
    console.log(`Move made on cell: ${row}, ${col} by ${turn}`);

    field[row][col] = turn;
    moveCount++;
    renderSymbolInCell(turn, row, col)
    turn = turn === CROSS ? ZERO : CROSS;

    let gameStatus = checkGameEnd();

    if (gameStatus) {
        let [winner, combination] = gameStatus;
        isGameEnded = true;

        alert(`Победил ${winner}`);
        paintCells(winner, combination);
        
    } else if (isFull()) {
        alert("Победила дружба");
    }

    if (moveCount >= fieldSize * fieldSize / 2) {
        extendField();
    }
}

function renderSymbolInCell(symbol, row, col, color = '#333') {
    const targetCell = findCell(row, col);

    targetCell.textContent = symbol;
    targetCell.style.color = color;
}

function findCell(row, col) {
    const targetRow = container.querySelectorAll('tr')[row];
    return targetRow.querySelectorAll('td')[col];
}

function addResetListener() {
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', resetClickHandler);
}

function resetClickHandler() {
    console.log('reset!');
    field = Array.from({ length: fieldSize }).map(
        () => Array.from({ length: fieldSize }).map(() => EMPTY)
    )
    turn = CROSS;
    moveCount = 0;
    isGameEnded = false;
    startGame();
}

function extendField() {
    if (fieldSize + 2 > MAX_FIELD_SIZE) {
        return;
    }

    fieldSize += 2;
    let newField = Array.from({ length: fieldSize }).map(
        () => Array.from({ length: fieldSize }).map(() => EMPTY)
    );

    for (let i = 1; i < fieldSize - 1; i++) {
        for (let j = 1; j < fieldSize - 1; j++) {
            newField[i][j] = field[i - 1][j - 1];
        }
    }

    field = newField;
    renderGrid();
}


/* Test Function */
/* Победа первого игрока */
function testWin() {
    clickOnCell(0, 2);
    clickOnCell(0, 0);
    clickOnCell(2, 0);
    clickOnCell(1, 1);
    clickOnCell(2, 2);
    clickOnCell(1, 2);
    clickOnCell(2, 1);
}

/* Ничья */
function testDraw() {
    clickOnCell(2, 0);
    clickOnCell(1, 0);
    clickOnCell(1, 1);
    clickOnCell(0, 0);
    clickOnCell(1, 2);
    clickOnCell(1, 2);
    clickOnCell(0, 2);
    clickOnCell(0, 1);
    clickOnCell(2, 1);
    clickOnCell(2, 2);
}

function clickOnCell(row, col) {
    findCell(row, col).click();
}
