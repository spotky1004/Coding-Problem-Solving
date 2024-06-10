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
check(`3
8
0 0
7 0
100
0 0
30 50
10
1 1
1 1`,
`5
28
0`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[T], ...lines] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const delta = [
  [2, 1], [2, -1], [-2, 1], [-2, -1],
  [1, 2], [1, -2], [-1, 2], [-1, -2]
];

const out = [];
for (let tc = 0; tc < T; tc++) {
  const [[l], startPos, endPos] = lines.slice(3 * tc, 3 * (tc + 1));
  const board = Array.from({ length: l }, () => Array(l).fill(null));
  board[endPos[0]][endPos[1]] = -1;
  board[startPos[0]][startPos[1]] = 0;
  const queue = [startPos];
  loop: for (const [i, j] of queue) {
    const curMove = board[i][j];
    for (const [di, dj] of delta) {
      const ti = i + di, tj = j + dj;
      if (
        0 > ti || ti >= l ||
        0 > tj || tj >= l ||
        (board[ti][tj] !== -1 && board[ti][tj] !== null)
      ) continue;
      if (board[ti][tj] === -1) {
        board[ti][tj] = curMove + 1;
        break loop;
      }
      board[ti][tj] = curMove + 1;
      queue.push([ti, tj]);
    }
  }
  out.push(board[endPos[0]][endPos[1]]);
}

// output
return out.join("\n");
}
