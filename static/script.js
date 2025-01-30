class TicTacToe {
    constructor() {
        this.reset();
    }

    reset() {
        this.board = Array(9).fill(" ");
        this.currentPlayer = "X";
    }

    makeMove(position) {
        if (position >= 0 && position < 9 && this.board[position] === " ") {
            this.board[position] = this.currentPlayer;
            this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
            return true;
        }
        return false;
    }

    checkWinner() {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6] // diagonals
        ];

        for (const [a, b, c] of lines) {
            if (this.board[a] !== " " && 
                this.board[a] === this.board[b] && 
                this.board[a] === this.board[c]) {
                return this.board[a];
            }
        }
        return null;
    }

    isBoardFull() {
        return !this.board.includes(" ");
    }

    getEmptyPositions() {
        return this.board.reduce((positions, cell, index) => {
            if (cell === " ") positions.push(index);
            return positions;
        }, []);
    }

    clone() {
        const clone = new TicTacToe();
        clone.board = [...this.board];
        clone.currentPlayer = this.currentPlayer;
        return clone;
    }
}

function getBestMove(game) {
    const MAX_DEPTH = 6;
    
    function minimax(game, depth, isMaximizing) {
        const winner = game.checkWinner();
        if (winner === "O") return 10 - depth;
        if (winner === "X") return depth - 10;
        if (game.isBoardFull() || depth >= MAX_DEPTH) return 0;

        const scores = [];
        const moves = [];
        const positions = game.getEmptyPositions();

        for (const pos of positions) {
            const gameCopy = game.clone();
            gameCopy.makeMove(pos);
            
            const score = minimax(gameCopy, depth + 1, !isMaximizing);
            scores.push(score);
            moves.push(pos);
        }

        if (moves.length === 0) return 0;

        if (isMaximizing) {
            const maxScore = Math.max(...scores);
            return depth === 0 ? moves[scores.indexOf(maxScore)] : maxScore;
        } else {
            const minScore = Math.min(...scores);
            return depth === 0 ? moves[scores.indexOf(minScore)] : minScore;
        }
    }

    const bestMove = minimax(game.clone(), 0, true);
    return typeof bestMove === 'number' ? bestMove : game.getEmptyPositions()[0];
}

document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const status = document.getElementById('status');
    const resetBtn = document.getElementById('resetBtn');
    const vsHumanBtn = document.getElementById('vsHuman');
    const vsAIBtn = document.getElementById('vsAI');

    let gameMode = 'human';
    let isProcessingMove = false;
    let game = new TicTacToe();

    vsHumanBtn.addEventListener('click', () => {
        gameMode = 'human';
        vsHumanBtn.classList.add('active');
        vsAIBtn.classList.remove('active');
        resetGame();
    });

    vsAIBtn.addEventListener('click', () => {
        gameMode = 'ai';
        vsAIBtn.classList.add('active');
        vsHumanBtn.classList.remove('active');
        resetGame();
    });

    const updateBoard = () => {
        cells.forEach((cell, index) => {
            cell.textContent = game.board[index] === ' ' ? '' : game.board[index];
            cell.className = 'cell' + (game.board[index] !== ' ' ? 
                ` ${game.board[index].toLowerCase()}` : '');
        });
    };

    const handleMove = async (position) => {
        if (isProcessingMove) return;
        
        isProcessingMove = true;
        
        if (game.makeMove(position)) {
            updateBoard();
            
            const winner = game.checkWinner();
            if (winner) {
                status.textContent = `Player ${winner} wins!`;
                board.style.pointerEvents = 'none';
            } else if (game.isBoardFull()) {
                status.textContent = "It's a draw!";
                board.style.pointerEvents = 'none';
            } else {
                status.textContent = `Player ${game.currentPlayer}'s turn`;
                
                if (gameMode === 'ai' && game.currentPlayer === 'O') {
                    // Add delay for AI move
                    setTimeout(() => {
                        const aiMove = getBestMove(game);
                        handleMove(aiMove);
                    }, 300);
                } else {
                    board.style.pointerEvents = 'auto';
                }
            }
        }
        
        isProcessingMove = false;
    };

    const resetGame = () => {
        game.reset();
        updateBoard();
        status.textContent = `Player ${game.currentPlayer}'s turn`;
        board.style.pointerEvents = 'auto';
        isProcessingMove = false;
    };

    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            if (!isProcessingMove && cell.textContent === '') {
                const position = parseInt(cell.dataset.index);
                handleMove(position);
            }
        });
    });

    resetBtn.addEventListener('click', resetGame);

    // Initialize the game
    resetGame();
});