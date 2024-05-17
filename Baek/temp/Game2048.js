const BLOCK_WEIGHT = 4;
const CORNER_WEIGHT = 1;
const SNAKE_WEIGHT = 4;
const POSITION_WEIGHT = 2;
const MERGEABLE_WEIGHT = 2;

class Game2048 {
  /** @type {[dx: number, dy: number]} */
  prevMove = [0, 0];
  /** @type {number[][]} */
  board = Array.from({ length: 4 }, () => Array(4).fill(0));

  constructor() {}

  move(dx, dy) {
    const newGame = new Game2048();
    newGame.prevMove = [dx, dy];
    newGame.board = this.board.map(row => [...row]);
    const board = newGame.board;
    if (dy === 0) {
      for (let i = 0; i < 4; i++) {
        const row = board[i].filter(v => v !== 0);
        for (let j = 0; j < 4; j++) board[i][j] = 0;
        if (dx === 1) row.reverse();
        for (let j = 0; j < row.length; j++) {
          if (row[j] === row[j + 1]) {
            row.splice(j + 1, 1);
            row[j] *= 2;
          }
        }
        if (dx === -1) {
          for (let j = 0; j < row.length; j++) board[i][j] = row[j];
        } else {
          for (let j = 0; j < row.length; j++) board[i][3 - j] = row[j];
        }
      }
    } else {
      for (let j = 0; j < 4; j++) {
        const col = [];
        for (let i = 0; i < 4; i++) {
          if (board[i][j] !== 0) col.push(board[i][j]);
          board[i][j] = 0;
        }
        if (dy === 1) col.reverse();
        for (let i = 0; i < col.length; i++) {
          if (col[i] === col[i + 1]) {
            col.splice(i + 1, 1);
            col[i] *= 2;
          }
        }
        if (dy === -1) {
          for (let i = 0; i < col.length; i++) board[i][j] = col[i];
        } else {
          for (let i = 0; i < col.length; i++) board[3 - i][j] = col[i];
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] !== board[i][j]) return newGame;
      }
    }
    return false;
  }

  calcRank() {
    const board = this.board;

    let rank = this.board.flat().reduce((a, b) => a + b ** BLOCK_WEIGHT, 0);

    let maxSnakeRank = 0;
    let posValue;
    let snakeRank;
    let snakeLen;
    let prev;
    for (const djs of [-1, 1]) {
      let dj = djs;
      posValue = POSITION_WEIGHT ** 16;
      snakeRank = 0;
      snakeLen = 0;
      prev = null;
      for (let i = 0; i < 4; i++) {
        let j = dj === -1 ? 3 : 0;
        while (0 <= j && j <= 3) {
          const cur = board[i][j];
          if (prev >= cur) {
            snakeRank += SNAKE_WEIGHT ** snakeLen * posValue * cur;
            snakeLen++;
          } else {
            snakeRank = posValue * cur;
            snakeLen = 1;
          }
          maxSnakeRank = Math.max(maxSnakeRank, snakeRank);
          prev = cur;
          posValue /= POSITION_WEIGHT;
          j += dj;
        }
        dj *= -1;
      }
      dj = djs;
      posValue = POSITION_WEIGHT ** 16;
      snakeRank = 0;
      snakeLen = 0;
      prev = null;
      for (let i = 3; i >= 0; i--) {
        let j = dj === -1 ? 3 : 0;
        while (0 <= j && j <= 3) {
          const cur = board[i][j];
          if (prev >= cur) {
            snakeRank += SNAKE_WEIGHT ** snakeLen * posValue * cur;
            snakeLen++;
          } else {
            snakeRank = posValue * cur;
            snakeLen = 1;
          }
          maxSnakeRank = Math.max(maxSnakeRank, snakeRank);
          prev = cur;
          posValue /= POSITION_WEIGHT;
          j += dj;
        }
        dj *= -1;
      }
    }
    for (const dis of [-1, 1]) {
      let di = dis;
      posValue = POSITION_WEIGHT ** 16;
      snakeRank = 0;
      snakeLen = 0;
      prev = null;
      for (let j = 0; j < 4; j++) {
        let i = di === -1 ? 3 : 0;
        while (0 <= i && i <= 3) {
          const cur = board[i][j];
          if (prev >= cur) {
            snakeRank += SNAKE_WEIGHT ** snakeLen * posValue * cur;
            snakeLen++;
          } else {
            snakeRank = posValue * cur;
            snakeLen = 1;
          }
          maxSnakeRank = Math.max(maxSnakeRank, snakeRank);
          prev = cur;
          posValue /= POSITION_WEIGHT;
          i += di;
        }
        di *= -1;
      }
      di = dis;
      posValue = POSITION_WEIGHT ** 16;
      snakeRank = 0;
      snakeLen = 0;
      prev = null;
      for (let j = 3; j >= 0; j--) {
        let i = di === -1 ? 3 : 0;
        while (0 <= i && i <= 3) {
          const cur = board[i][j];
          if (prev >= cur) {
            snakeRank += SNAKE_WEIGHT ** snakeLen * posValue * cur;
            snakeLen++;
          } else {
            snakeRank = posValue * cur;
            snakeLen = 1;
          }
          maxSnakeRank = Math.max(maxSnakeRank, snakeRank);
          prev = cur;
          posValue /= POSITION_WEIGHT;
          i += di;
        }
        di *= -1;
      }
    }

    rank *= maxSnakeRank;
    rank *= MERGEABLE_WEIGHT ** this.mergeableCount();

    const maxBlock = Math.max(...board.flat());
    if (
      board[0][0] === maxBlock ||
      board[0][3] === maxBlock ||
      board[3][0] === maxBlock ||
      board[3][3] === maxBlock
    ) rank *= CORNER_WEIGHT;

    return Math.round(rank);
  }

  calcBestMove(depth = 1) {
    const directions = [
      [0, -1], [0, 1],
      [-1, 0], [1, 0]
    ];

    /** @type {[direction: [dx: number, dy: number], game: Game2048, rank: number][]} */
    let moves = [];
    for (const [dx, dy] of directions) {
      const game = this.move(dx, dy);
      moves.push([[dx, dy], game, 0]);
    }
    moves = moves.filter(v => v[1]);

    for (let i = 1; i < depth; i++) {
      const newMoves = [];
      for (const [direction, game] of moves) {
        for (const [dx, dy] of directions) {
          newMoves.push([direction, game.move(dx, dy), 0]);
        }
      }
      moves = newMoves.filter(v => v[1]);
    }

    for (const move of moves) move[2] = move[1].calcRank();
    const bestMove = moves.sort((a, b) => b[2] - a[2])[0][0];

    let bestMoveName = "";
    if (bestMove[0] === -1) bestMoveName = "LEFT";
    else if (bestMove[0] === 1) bestMoveName = "RIGHT";
    else if (bestMove[1] === -1) bestMoveName = "UP";
    else if (bestMove[1] === 1) bestMoveName = "DOWN";
    /** @type {Game2048} */
    const bestGame = this.move(bestMove[0], bestMove[1]);

    return [bestMoveName, bestGame];
  }

  mergeableCount() {
    const board = this.board;
    let count = 0;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const cur = board[i][j];
        if (
          cur === 0 ||
          i !== 0 && board[i - 1][j] === cur ||
          i !== 3 && board[i + 1][j] === cur ||
          board[i][j + 1] === cur ||
          board[i][j - 1] === cur
        ) count++;
      }
    }
    return count;
  }

  isEnd() {
    return this.mergeableCount() === 0;
  }

  place(pos, value) {
    pos--;
    const y = Math.floor(pos / 4);
    const x = pos - 4 * y;
    this.board[y][x] = value;
  }

  print() {
    const out = Array.from({ length: 12 }, () => Array(24).fill(" "));
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        out[3 * i][6 * j] = "┌";
        out[3 * i][6 * j + 1] = "─";
        out[3 * i][6 * j + 2] = "─";
        out[3 * i][6 * j + 3] = "─";
        out[3 * i][6 * j + 4] = "─";
        out[3 * i][6 * j + 5] = "┐";
        out[3 * i + 1][6 * j] = "│";
        out[3 * i + 1][6 * j + 5] = "│";
        out[3 * i + 2][6 * j] = "└";
        out[3 * i + 2][6 * j + 1] = "─";
        out[3 * i + 2][6 * j + 2] = "─";
        out[3 * i + 2][6 * j + 3] = "─";
        out[3 * i + 2][6 * j + 4] = "─";
        out[3 * i + 2][6 * j + 5] = "─";
        out[3 * i + 2][6 * j + 5] = "┘";
        if (this.board[i][j] === 0) continue;
        let numToPrint = this.board[i][j].toString();
        if (numToPrint.length < 4) numToPrint = " " + numToPrint;
        numToPrint = numToPrint.padEnd(4, " ");
        for (let k = 0; k < 4; k++) {
          out[3 * i + 1][6 * j + 1 + k] = numToPrint[k];
        }
      }
    }
    for (let i = 0; i < 12; i++) {
      out[i].unshift("│ ");
      out[i].push(" │");
    }
    const [dx, dy] = this.prevMove;
    let moveStr = dx === 0 && dy === 0 ? "NONE" : dx === -1 ? "LEFT" : dx === 1 ? "RIGHT" : dy === -1 ? "UP" : "DOWN";
    const score = Math.max(...this.board.flat());
    out.unshift(["┌" + (`Move: ${moveStr.padEnd(5, " ")} ─ Score:` + score.toString().padStart(5, " ") + " ").padStart(26, "─") + "┐"]);
    const rank = this.calcRank();
    out.push(["└" + `Rank: ${rank.toString().padStart(18, " ")}`.padStart(26, "─") + "┘"]);
    return out.map(row => row.join("")).join("\n");
  }
}


const game = new Game2048();
game.board = [
  [2, 4, 32, 128],
  [0, 2, 16, 256],
  [0, 4, 8, 512],
  [0, 4, 4, 1024]
];
console.log(game.calcBestMove());
