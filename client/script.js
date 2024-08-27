const ws = new WebSocket('ws://localhost:3000');
let player = null;
let currentState = null;
let selectedCharacter = null;
ws.onopen = () => {
    console.log('WebSocket connection opened');
};
ws.onmessage = (event) => {
    console.log('Message received:', event.data);
    const { type, gameState, player: assignedPlayer } = JSON.parse(event.data);
    if (type === 'init') {
        player = assignedPlayer;
        document.getElementById('game-info').textContent = `You are ${player}`;
    } else if (type === 'update') {
        currentState = gameState;
        console.log('Updating board with state:', gameState);
        renderBoard(gameState.board);
        document.getElementById('game-info').textContent = `Current turn: ${gameState.currentPlayer}`;
    }
};
ws.onerror = (error) => {
    console.error('WebSocket error:', error);
};
function renderBoard(board) {
    console.log('Rendering board...');
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (board && board[i][j]) {
                cell.textContent = board[i][j];
                cell.classList.add(board[i][j].startsWith('A-') ? 'player1' : 'player2');
            }
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', () => handleCellClick(i, j));
            gameBoard.appendChild(cell);
        }
    }
    console.log('Board rendering complete.');
}
function handleCellClick(x, y) {
    console.log(`Cell clicked: (${x}, ${y})`);
    if (!currentState) {
        console.log('Current state is null. Using initial board state.');
        currentState = {
            board: [
                ['A-P1', 'A-P2', 'A-H1', 'A-H2', 'A-H3'],
                [null, null, null, null, null],
                [null, null, null, null, null],
                [null, null, null, null, null],
                ['B-P1', 'B-P2', 'B-H1', 'B-H2', 'B-H3']
            ],
            currentPlayer: 'Player1'
        };
    }
    const clickedChar = currentState.board[x][y];
    console.log('Clicked character:', clickedChar);
    if (selectedCharacter) {
        if (isValidMove(selectedCharacter.x, selectedCharacter.y, x, y)) {
            makeMove({ from: [selectedCharacter.x, selectedCharacter.y], to: [x, y] });
            clearHighlights();
            selectedCharacter = null;
        } else {
            console.log("Invalid move.");
        }
    } else if (clickedChar) {
        selectedCharacter = { x, y, char: clickedChar };
        highlightValidMoves(x, y, clickedChar);
    } else {
        console.log("Select a character.");
    }
}
function highlightValidMoves(x, y, char) {
    clearHighlights();
    const moves = getValidMoves(x, y, char);
    moves.forEach(([newX, newY]) => {
        const cell = document.querySelector(`.cell[data-row="${newX}"][data-col="${newY}"]`);
        if (cell) {
            cell.classList.add('highlight');
        }
    });
}
function clearHighlights() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.classList.remove('highlight'));
}
function getValidMoves(x, y, char) {
    const moves = [];
    let directions;
    if (char.includes('P')) {
        directions = [[0, -1], [0, 1], [-1, 0], [1, 0]]; 
    } else if (char.includes('H1')) {
        directions = [[0, -2], [0, 2], [-2, 0], [2, 0]]; 
    } else if (char.includes('H2')) {
        directions = [[-2, -2], [-2, 2], [2, -2], [2, 2]]; 
    } else if (char.includes('H3')) {
        directions = [
            [-2, -1], [-2, 1], [2, -1], [2, 1], 
            [-1, -2], [-1, 2], [1, -2], [1, 2]  
        ];
    }
    directions.forEach(([dx, dy]) => {
        const newX = x + dx;
        const newY = y + dy;
        if (newX >= 0 && newX < 5 && newY >= 0 && newY < 5) {
            const target = currentState.board[newX][newY];
            if (!target || !target.startsWith(char[0])) {
                moves.push([newX, newY]);
            }
        }
    });
    return moves;
}
function isValidMove(fromX, fromY, toX, toY) {
    const char = currentState.board[fromX][fromY];
    const validMoves = getValidMoves(fromX, fromY, char);
    return validMoves.some(([x, y]) => x === toX && y === toY);
}
function makeMove(move) {
    console.log('Making move:', move);
    const [fromX, fromY] = move.from;
    const [toX, toY] = move.to;
    currentState.board[toX][toY] = currentState.board[fromX][fromY];
    currentState.board[fromX][fromY] = null;
    renderBoard(currentState.board);
    ws.send(JSON.stringify({ type: 'move', move, player }));
}
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded. Rendering initial board.');
    renderBoard([
        ['A-P1', 'A-P2', 'A-H1', 'A-H2', 'A-H3'],
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null],
        ['B-P1', 'B-P2', 'B-H1', 'B-H2', 'B-H3']
    ]);
});
