const input = require("fs").readFileSync("./AOC/2023/3.in", "utf-8");
const board = input
  .split("\n")
  .map(line => Array.from(line));

const N = board.length;
const M = board[0].length;

const isDigit = (x) => "0123456789".includes(x);

let sum = 0;
for (let i = 0; i < N; i++) {
  let stack = [];
  for (let j = 0; j < M + 1; j++) {
    const c = board[i][j];
    if (isDigit(c)) {
      stack.push(c);
    } else {
      const num = +stack.join("");
      const len = stack.length;
      stack = [];
      if (len === 0) continue;

      const s = j - len - 1;
      const e = j;
      const nears = (board[i - 1] ?? []).slice(Math.max(0, s), e + 1)
        .concat([board[i][s], board[i][e]].filter(v => v))
        .concat((board[i + 1] ?? []).slice(Math.max(0, s), e + 1))
        .filter(v => v !== ".")
        .filter(v => !isDigit(v))
        .filter(v => v !== "\r");
      
      if (nears.length === 0) continue;
      sum += num;
    }
  }
}

console.log(sum);
