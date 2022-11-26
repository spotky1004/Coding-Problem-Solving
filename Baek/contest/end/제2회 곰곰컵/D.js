const board = (require('fs').readFileSync(0)+"").trim().split("\n").slice(1).map(row => Array.from(row));
const N = board.length;
let minX = Infinity;
let minY = Infinity;
let maxX = -Infinity;
let maxY = -Infinity;
for (let y = 0; y < N; y++) {
  for (let x = 0; x < N; x++) {
    if (board[y][x] !== "G") continue;
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }
}

const xMoveCount = minX !== maxX ? (maxX - minX) + Math.min(minX, N - maxX - 1) : 0;
const yMoveCount = minY !== maxY ? (maxY - minY) + Math.min(minY, N - maxY - 1) : 0;
console.log(xMoveCount + yMoveCount);