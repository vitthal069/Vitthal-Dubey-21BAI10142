const WebSocket = require('ws');
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const wss = new WebSocket.Server({ noServer: true });
app.use(express.static(path.join(__dirname, 'client')));
const server = app.listen(port, () => {
    console.log(`HTTP server is running on http://localhost:${port}`);
});
server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, ws => {
        wss.emit('connection', ws, request);
    });
});
let gameState = {
    board: Array(5).fill(null).map(() => Array(5).fill(null)),
    players: {},
    currentPlayer: 'Player1',
};
wss.on('connection', (ws) => {
    const player = Object.keys(gameState.players).length === 0 ? 'Player1' : 'Player2';
    gameState.players[player] = ws;
    ws.send(JSON.stringify({ type: 'init', player }));

    ws.on('message', (message) => {
        const { type, move, player: currentPlayer } = JSON.parse(message);

        if (type === 'move' && gameState.currentPlayer === currentPlayer) {
            console.log(`Move received: ${move} from ${player}`);
            gameState.currentPlayer = gameState.currentPlayer === 'Player1' ? 'Player2' : 'Player1';
            broadcastGameState();
        }
    });
    ws.on('close', () => {
        delete gameState.players[player];
        if (Object.keys(gameState.players).length === 0) {
            resetGameState();
        }
    });
});
function broadcastGameState() {
    console.log('Broadcasting game state:', gameState);
    Object.values(gameState.players).forEach((ws) => {
        ws.send(JSON.stringify({ type: 'update', gameState }));
    });
}
function resetGameState() {
    gameState.board = Array(5).fill(null).map(() => Array(5).fill(null));
    gameState.currentPlayer = 'Player1';
    gameState.players = {};
}
