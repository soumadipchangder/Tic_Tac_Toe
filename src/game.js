export class TicTacToe {
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