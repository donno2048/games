const sequence = [0, 1, 2, 3, 4, 5, 6];
function getNextTetromino() {
    if (tetrominoSequence.length === 0) while (sequence.length) tetrominoSequence.push(sequence.splice(Math.floor(Math.random() * sequence.length), 1)[0]);
    const name = tetrominoSequence.pop();
    return {name: name, matrix: tetrominos[name], row: name === 'I' ? -1 : -2, col: playfield[0].length / 2 - Math.ceil(tetrominos[name][0].length / 2)};
}
function isValidMove(matrix, cellRow, cellCol) {for (let row = 0; row < matrix.length; row++) for (let col = 0; col < matrix[row].length; col++) if (matrix[row][col] && (cellCol + col < 0 ||cellCol + col >= playfield[0].length ||cellRow + row >= playfield.length ||playfield[cellRow + row][cellCol + col])) return false; return true;}
function placeTetromino() {
    for (let row = 0; row < tetromino.matrix.length; row++) {
        for (let col = 0; col < tetromino.matrix[row].length; col++) {
            if (tetromino.matrix[row][col]) {
                if (tetromino.row + row < 0) return showGameOver();
                playfield[tetromino.row + row][tetromino.col + col] = tetromino.name;
            }
        }
    }
    for (let row = playfield.length - 1; row >= 0; ) {if (playfield[row].every(cell => !!cell)) for (let r = row; r >= 0; r--) for (let c = 0; c < playfield[r].length; c++) playfield[r][c] = playfield[r-1][c];else row--;}
    tetromino = getNextTetromino();
}
function showGameOver() {
    cancelAnimationFrame(rAF);
    gameOver = true;
    context.fillStyle = 'black';
    context.globalAlpha = 0.75;
    context.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);
    context.globalAlpha = 1;
    context.fillStyle = 'white';
    context.font = '36px monospace';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
}
const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const tetrominoSequence = [];
const playfield = [];
for (let row = -2; row < 20; row++) {
    playfield[row] = [];
    for (let col = 0; col < 10; col++) playfield[row][col] = 0;
}
const tetrominos = [[[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],[[1,0,0],[1,1,1],[0,0,0]],[[0,0,1],[1,1,1],[0,0,0]],[[1,1],[1,1]],[[0,1,1],[1,1,0],[0,0,0]],[[1,1,0],[0,1,1],[0,0,0]],[[0,1,0],[1,1,1],[0,0,0]]];
const colors = ['cyan', 'yellow', 'purple', 'green', 'red', 'blue', 'orange'];
let count = 0;
let tetromino = getNextTetromino();
let rAF = null;
let gameOver = false;
function loop() {
    rAF = requestAnimationFrame(loop);
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let row = 0; row < 20; row++)
        for (let col = 0; col < 10; col++)
            if (playfield[row][col]) {
                context.fillStyle = colors[playfield[row][col]];
                context.fillRect(col * 32, row * 32, 31, 31);
            }
    if (tetromino) {
        if (++count > 35) {
            tetromino.row++;
            count = 0;
            if (!isValidMove(tetromino.matrix, tetromino.row, tetromino.col)) {
                tetromino.row--;
                placeTetromino();
            }
        }
        context.fillStyle = colors[tetromino.name];
        for (let row = 0; row < tetromino.matrix.length; row++) for (let col = 0; col < tetromino.matrix[row].length; col++) if (tetromino.matrix[row][col]) context.fillRect((tetromino.col + col) * 32, (tetromino.row + row) * 32, 31, 31);
    }
}
document.addEventListener('keydown', function(e) {
    if (gameOver) return;
    if (e.which === 37 || e.which === 39) {
        const col = e.which === 37? tetromino.col - 1: tetromino.col + 1;
        if (isValidMove(tetromino.matrix, tetromino.row, col)) tetromino.col = col;
    }
    if (e.which === 38) {
        const matrix = tetromino.matrix.map((row, i) => row.map((val, j) => tetromino.matrix[tetromino.matrix.length - j - 1][i]));
        if (isValidMove(matrix, tetromino.row, tetromino.col)) tetromino.matrix = matrix;
    }
    if(e.which === 40) {
        const row = tetromino.row + 1;
        if (!isValidMove(tetromino.matrix, row, tetromino.col)) {
            tetromino.row = row - 1;
            placeTetromino();
            return;
        }
        tetromino.row = row;
    }
});
rAF = requestAnimationFrame(loop);