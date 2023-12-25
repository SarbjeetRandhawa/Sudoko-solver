var arr = [[], [], [], [], [], [], [], [], []];

for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
        arr[i][j] = document.getElementById(i * 9 + j);
    }
}

var board = [[], [], [], [], [], [], [], [], []];

function FillBoard(board) {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (board[i][j] != 0) {
                arr[i][j].innerText = board[i][j];
            } else {
                arr[i][j].innerText = '';
            }
        }
    }
}

let GetPuzzle = document.getElementById('GetPuzzle');
let SolvePuzzle = document.getElementById('SolvePuzzle');

GetPuzzle.onclick = function () {
    var xhrRequest = new XMLHttpRequest();

    xhrRequest.onload = function () {
        if (xhrRequest.status === 200) {
            var response = JSON.parse(xhrRequest.responseText);
            console.log(response);

            var boardData = response.newboard.grids[0].value;
            FillBoard(boardData);
            board = boardData; // Set the global board variable
        } else {
            console.error("Request failed with status: " + xhrRequest.status);
        }
    };

    var apiUrl = 'https://sudoku-api.vercel.app/api/dosuku';
    xhrRequest.open('GET', apiUrl);
    xhrRequest.send();
};

SolvePuzzle.onclick = function () {
    sudokuSolver(board, 0, 0, 9);
};

function sudokuSolver(board, row, col, n) {
    if (row === n) {
        FillBoard(board);
        return true;
    }

    if (col === n) {
        return sudokuSolver(board, row + 1, 0, n);
    }

    if (board[row][col] !== 0) {
        return sudokuSolver(board, row, col + 1, n);
    }

    for (let num = 1; num <= 9; num++) {
        if (isPossible(board, row, col, num, n)) {
            board[row][col] = num;
            let subans = sudokuSolver(board, row, col + 1, n);
            if (subans) {
                return true;
            }
            board[row][col] = 0;
        }
    }

    return false;
}

function isPossible(board, row, col, num, n) {
    for (let i = 0; i < n; i++) {
        if (board[row][i] === num) {
            return false;
        }
    }

    for (let i = 0; i < n; i++) {
        if (board[i][col] === num) {
            return false;
        }
    }

    let rn = Math.sqrt(n);
    let srow = row - (row % rn);
    let scol = col - (col % rn);

    for (let x = srow; x < srow + rn; x++) {
        for (let y = scol; y < scol + rn; y++) {
            if (board[x][y] === num) {
                return false;
            }
        }
    }

    return true;
}
