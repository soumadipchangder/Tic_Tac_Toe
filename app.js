import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { TicTacToe } from './src/game.js';
import { getBestMove } from './src/ai-player.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static('static'));

const game = new TicTacToe();

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'static', 'index.html'));
});

app.post('/api/move', async (req, res) => {
    const { position, gameMode } = req.body;
    
    // Player's move
    if (!game.makeMove(position)) {
        return res.status(400).json({ error: 'Invalid move' });
    }

    let gameState = getGameState();

    // If game is not over and it's vs AI, make AI move
    if (gameMode === 'ai' && !gameState.gameOver && game.currentPlayer === 'O') {
        // Add a small delay to make AI moves feel more natural
        await new Promise(resolve => setTimeout(resolve, 300));
        const aiMove = getBestMove(game);
        game.makeMove(aiMove);
        gameState = getGameState();
    }
    
    res.json(gameState);
});

app.post('/api/reset', (req, res) => {
    game.reset();
    res.json(getGameState());
});

function getGameState() {
    const winner = game.checkWinner();
    const isDraw = game.isBoardFull();
    return {
        board: game.board,
        currentPlayer: game.currentPlayer,
        winner: winner,
        isDraw: isDraw,
        gameOver: winner !== null || isDraw
    };
}

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});