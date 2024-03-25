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
check(`2 3
123
312`,
`435`);
check(`2 2
99
11`,
`182`);
check(`4 3
001
010
111
100`,
`1131`);
check(`1 1
8`,
`8`);
check(`4 4
4937
2591
3846
9150`,
`24925`);
check(`5 5
12345
23456
34567
45678
56789`,
`172835`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const lines = input
  .trim()
  .split("\n");
const [N, M] = lines.shift().split(" ").map(Number);
const board = lines.map(row => Array.from(row).map(Number));

// code
const boardBits = Array.from({ length: N }, () => Array(M).fill(-1));
for (let i = 0; i < N; i++) {
  for (let j = 0; j < M; j++) boardBits[i][j] = 1 << (i * M + j);
}

/** @type {[value: number, mask: number][]} */
const pieces = [];
for (let i = 0; i < N; i++) {
  for (let js = 0; js < M; js++) {
    let pieceValue = 0, pieceMask = 0;
    for (let j = js; j < M; j++) {
      pieceValue = 10 * pieceValue + board[i][j];
      pieceMask += boardBits[i][j];
      pieces.push([pieceValue, pieceMask]);
    }
  }
}
for (let j = 0; j < M; j++) {
  for (let is = 0; is < N; is++) {
    let pieceValue = 0, pieceMask = 0;
    for (let i = is; i < N; i++) {
      pieceValue = 10 * pieceValue + board[i][j];
      pieceMask += boardBits[i][j];
      pieces.push([pieceValue, pieceMask]);
    }
  }
}

const MAX_MASK = (1 << (N * M)) - 1;
const dp = Array(MAX_MASK + 1).fill(null);
dp[0] = 0;

function search(mask) {
  if (dp[mask] !== null) return dp[mask];

  let maxValue = 0;
  for (const [pieceValue, pieceMask] of pieces) {
    if ((mask & pieceMask) !== pieceMask) continue;
    maxValue = Math.max(
      maxValue,
      pieceValue + search(mask ^ pieceMask)
    );
  }
  dp[mask] = maxValue;
  return maxValue;
}
const ans = search(MAX_MASK);

// output
return ans;
}
