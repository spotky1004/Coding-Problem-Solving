const isWeb = typeof window === "object";
const isDev = isWeb || require("fs").existsSync("C:/users/spotky");

if (!isDev) {
  const input = require("fs").readFileSync("/dev/stdin").toString();
  const out = solve(input);
  if (!isWeb) {
    process.stdout.write(out.toString());
    process.exit(0);
  } else {
    console.log(out);
  }
} else {
  if (!isWeb) require('node:v8').setFlagsFromString('--stack-size=65536');

  let CASE_NR = 1;
  function check(input, answer, caseName=`Case ${CASE_NR}`) {
    CASE_NR++;
    const startTime = new Date().getTime();
    const startMemory = !isWeb ? process.memoryUsage().heapUsed : window.performance.memory.usedJSHeapSize;
    const out = solve(input).toString().trim();
    const timeDeltaStr = (new Date().getTime() - startTime).toString();
    const timeDeltaZeroStr = " "+"0".repeat(6 - timeDeltaStr.length);
    const memoryDelta = (((!isWeb ? process.memoryUsage().heapUsed : window.performance.memory.usedJSHeapSize) - startMemory) / 1024).toFixed(0);
    const memoryDeltaZeroStr = " "+"0".repeat(8 - memoryDelta.length);
    if (
      typeof answer === "string" ?
        out === answer :
        answer.includes(out)
    ) console.log("\x1b[1m%s\x1b[42m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[0m", `${caseName}: `, ` AC `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB");
    else console.log("\x1b[1m%s\x1b[41m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[31m%s\x1b[0m", `${caseName}: `, ` WA `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB\n", out.slice(0, 10000));
  }

// cases
check(`5 6
*.*...
..||..
..@*|*
.*.*..
..*##.`,
`4 5`);
check(`7 9
...#...#.
.*.*..*..
...*..#..
...**.*..
.*..*.@..
.#...**..
..#.#..*.`,
`10 8`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [, ...rawBoard] = input
  .trim()
  .split("\n");

// code
const N = rawBoard.length;
const M = rawBoard[0].length;

const board = [];
const bigZizins = [];
for (let i = 0; i < N; i++) {
  const row = [];
  board.push(row);
  for (let j = 0; j < M; j++) {
    const cell = rawBoard[i][j];
    if (cell === ".") row.push(0);
    if (cell === "|") row.push(Infinity);
    if (cell === "@") {
      row.push(0);
      bigZizins.push([i, j]);
    }
    if (cell === "*") row.push(1);
    if (cell === "#") row.push(2);
  }
}

const delta = [
  [1, 0], [-1, 0],
  [0, 1], [0, -1]
];

const smallZizins = [];
for (const [i, j] of bigZizins) {
  for (const [di, dj] of delta) {
    for (let m = 1; m <= 2; m++) {
      const [ti, tj] = [i + m * di, j + m * dj];
      if (
        0 > ti || ti >= N ||
        0 > tj || tj >= M ||
        !isFinite(board[ti][tj])
      ) break;
      if (board[ti][tj] === 1) {
        board[ti][tj] = -1;
        smallZizins.push([ti, tj]);
      }
      if (board[ti][tj] === 2) {
        board[ti][tj] = 1;
      }
    }
  }
}

while (smallZizins.length > 0) {
  const copy = [...smallZizins];
  smallZizins.length = 0;
  for (const [i, j] of copy) {
    for (const [di, dj] of delta) {
      for (let m = 1; m <= 1; m++) {
        const [ti, tj] = [i + m * di, j + m * dj];
        if (
          0 > ti || ti >= N ||
          0 > tj || tj >= M ||
          !isFinite(board[ti][tj])
        ) break;
        if (board[ti][tj] === 1) {
          board[ti][tj] = -1;
          smallZizins.push([ti, tj]);
        }
        if (board[ti][tj] === 2) {
          board[ti][tj] = 1;
        }
      }
    }
  }
}

// output
return `${board.flat().reduce((a, b) => a + (b === -1), 0)} ${board.flat().reduce((a, b) => a + (b === 1 || b === 2), 0)}`;
}
