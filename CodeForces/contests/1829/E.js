const [, ...cases] =
(require('fs').readFileSync(0)+"")
// `5
// 5 5
// 1 1 1 1 1
// 1 0 0 0 1
// 1 0 5 0 1
// 1 0 0 0 1
// 1 1 1 1 1
// `
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const out = [];

const directions = [
  [1, 0], [-1, 0],
  [0, 1], [0, -1]
]
function calcVolume(board, x, y) {
  let v = board[y][x];
  const queue = [[x, y]];

  board[y][x] = 0;
  for (const [x, y] of queue) {
    for (const [tx, ty] of directions) {
      const nx = x + tx;
      const ny = y + ty;
      if (
        typeof ((board[ny] ? board[ny] : [])[nx]) === "undefined" ||
        board[ny][nx] === 0
      ) continue;

      v += board[ny][nx];
      board[ny][nx] = 0;
      queue.push([nx, ny]);
    }
  }

  return v;
}

let i = 0;
while (i < cases.length) {
  const [n, m] = cases[i];
  i++;
  const board = cases.slice(i, i + n);
  i += n;

  let max = 0;
  for (let y = 0; y < n; y++) {
    const row = board[y];
    for (let x = 0; x < m; x++) {
      if (row[x] === 0) continue;
      max = Math.max(max, calcVolume(board, x, y));
    }
  }

  out.push(max);
}

console.log(out.join("\n"));
