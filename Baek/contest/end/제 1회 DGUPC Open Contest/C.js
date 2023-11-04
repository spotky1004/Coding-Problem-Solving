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
    const startMemory = !isWeb ? process.memoryUsage().heapUsed / 1024 : 0;
    const out = solve(input).toString().trim();
    const timeDeltaStr = (new Date().getTime() - startTime).toString();
    const timeDeltaZeroStr = " "+"0".repeat(6 - timeDeltaStr.length);
    const memoryDelta = ((!isWeb ? process.memoryUsage().heapUsed / 1024 : 0) - startMemory).toFixed(0);
    const memoryDeltaZeroStr = " "+"0".repeat(8 - memoryDelta.length);
    if (
      typeof answer === "string" ?
        out === answer :
        answer.includes(out)
    ) console.log("\x1b[1m%s\x1b[42m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[0m", `${caseName}: `, ` AC `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB");
    else console.log("\x1b[1m%s\x1b[41m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[31m%s\x1b[0m", `${caseName}: `, ` WA `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB\n", out.slice(0, 10000));
  }

// cases
// check(`0010
// 1100
// 0001
// 0100
// 0000
// 0110
// 0110
// 0010`,
// `5`);
check(
`1111
0000
0000
0000
0000
0000
0000
1111`,
`8`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const boards = input
  .trim()
  .split("\n")

// code
const A = boards.slice(0, 4).join("");
const B = boards.slice(4).join("");
let initialState = 0;
let goalState = 0;
for (let i = 0; i < 16; i++) {
  const mask = 1 << i;
  if (A[15 - i] === "1") initialState += mask;
}
for (let i = 0; i < 16; i++) {
  const mask = 1 << i;
  if (B[15 - i] === "1") goalState += mask;
}

const prevState = Array((1 << 17) - 1).fill(-1);
const dp = Array((1 << 17) - 1).fill(-1);
dp[initialState] = 0;

const queue = [initialState];
const boardIdx = [
  [15, 14, 13, 12],
  [11, 10, 9, 8],
  [7, 6, 5, 4],
  [3, 2, 1, 0]
]
const avaiableMoves = [
  [1, 2], [2, 1],
  [-1, 2], [2, -1],
  [1, -2], [-2, 1],
  [-1, -2], [-2, -1]
];
loop: for (const state of queue) {
  for (let i = 0; i < 16; i++) {
    const mask = 1 << i;
    if (!(state & mask)) continue;

    const x = 3 - (i % 4);
    const y = 3 - Math.floor(i / 4);
    for (const [dx, dy] of avaiableMoves) {
      const moveCell = (boardIdx[y + dy] ?? [])[x + dx];
      if (
        typeof moveCell === "undefined" ||
        (state & (1 << moveCell))
      ) continue;
      const newState = (state ^ mask) | (1 << moveCell);
      if (dp[newState] !== -1) continue;
      dp[newState] = dp[state] + 1;
      prevState[newState] = state;
      queue.push(newState);
      if (newState === goalState) break loop;
    }
  }
}

if (dp[goalState] === -1) throw "?";

// output
return dp[goalState];
}
