const input = require("fs").readFileSync("./AOC/2023/3.in", "utf-8");
const board = input
  .split("\n")
  .map(line => Array.from(line));

const N = board.length;
const M = board[0].length;

const directions = [
  [-1, -1], [0, -1], [1, -1],
  [-1,  0],          [1,  0],
  [-1,  1], [0,  1], [1,  1]
];

const isDigit = (x) => "0123456789".includes(x);

let sum = 0;
const visited = Array.from({ length: N }, _ => Array(M).fill(false));
for (let i = 0; i < N; i++) {
  for (let j = 0; j < M; j++) {
    const c = board[i][j];
    if (c !== "*") continue;
    const nums = [];
    for (const [di, dj] of directions) {
      const [ti, tj] = [i + di, j + dj];
      if (
        0 > ti || ti >= N ||
        0 > tj || tj >= M ||
        !isDigit(board[ti][tj]) ||
        visited[ti][tj]
      ) continue;
      visited[ti][tj] = true;

      let num = board[ti][tj];
      let x;

      x = tj - 1;
      while (isDigit(board[ti][x])) {
      visited[ti][x] = true;
      num = board[ti][x] + num;
        x--;
      }

      x = tj + 1;
      while (isDigit(board[ti][x])) {
        visited[ti][x] = true;
        num = num + board[ti][x];
        x++;
      }
      nums.push(num);
    }

    if (nums.length !== 2) continue;
    sum += nums[0] * nums[1];
  }
}

console.log(sum);
