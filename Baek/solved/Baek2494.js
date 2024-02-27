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
326
446`,
`4
1 1
2 1
3 -2`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [rawN, rawA, rawB] = input
  .trim()
  .split("\n")
const N = Number(rawN);
const A = Array.from(rawA).map(v => Number(v) - 1);
const B = Array.from(rawB).map(v => Number(v) - 1);

// code
const calcMoveCounts = (a, b) => a < b ? [b - a, (10 - b + a) % 10] : [(10 - a + b) % 10, a - b];

const dp = [];
dp.push(Array(10).fill(null));
if (A[0] !== B[0]) {
  const [l, r] = calcMoveCounts(A[0], B[0]);
  dp[0][l] = [l, `1 ${l}`, -1];
  if (r !== l) {
    dp[0][0] = [r, `1 ${-r}`, -1];
  } else {
    if (dp[0][0][0] > r) dp[0][0] = [r, `1 ${-r}`, -1]; 
  }
} else {
  dp[0][0] = [0, null, -1];
}

for (let i = 1; i < N; i++) {
  const dpRow = Array(10).fill(null);
  dp.push(dpRow);
  const a = A[i];
  const b = B[i];
  for (let j = 0; j < 10; j++) {
    if (dp[i - 1][j] === null) continue;
    const prevCount = dp[i - 1][j][0];
    const ap = (a + j) % 10;

    const [l, r] = calcMoveCounts(ap, b);
    const newLCount = prevCount + l;
    const newRCount = prevCount + r;

    const newShift = (j + l) % 10;
    if (
      dpRow[newShift] === null ||
      dpRow[newShift][0] > newLCount
    ) {
      if (l !== 0) dpRow[newShift] = [newLCount, `${i + 1} ${l}`, j];
      else dpRow[newShift] = [newLCount, null, j];
    }
    if (
      dpRow[j] === null ||
      dpRow[j][0] > newRCount
    ) {
      if (r !== 0) dpRow[j] = [newRCount, `${i + 1} ${-r}`, j];
      else dpRow[j] = [newRCount, null, j];
    }
  }
}

let minIdx = 0;
for (let i = 1; i < 10; i++) {
  if (dp[N - 1][i] === null) continue;

  const minCount = dp[N - 1][minIdx][0];
  const curCount = dp[N - 1][i][0];
  if (minCount > curCount) minIdx = i;
}

const minCount = dp[N - 1][minIdx][0];
let curIdx = minIdx;
const moves = [];
for (let i = N - 1; i >= 0; i--) {
  const [, move, nextIdx] = dp[i][curIdx];
  moves.push(move);
  curIdx = nextIdx;
}
moves.reverse();

// output
return `${minCount}\n${moves.join("\n")}`;
}
