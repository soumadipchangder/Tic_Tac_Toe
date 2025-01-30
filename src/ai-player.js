export function getBestMove(game) {
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