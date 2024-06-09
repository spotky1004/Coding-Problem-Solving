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
check(`14 12`, `16`);
check(`2000 1800`, `47168488`);
check(`5 6`, `0`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, B]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const mod = 1_000_000_000;
const maxDigit = B - 1;

// [none, has zero, has (B - 1), has zero and (B - 1)]
let dp = [
  Array(B).fill(0),
  Array(B).fill(0),
  Array(B).fill(0),
  Array(B).fill(0)
];
for (let i = 1; i < maxDigit; i++) dp[0][i]++;
dp[2][maxDigit]++;
// console.table(dp);

for (let i = 1; i < N; i++) {
  const nextDp = [
    Array(B).fill(0),
    Array(B).fill(0),
    Array(B).fill(0),
    Array(B).fill(0)
  ];
  for (let j = 0; j < B; j++) {
    if (j !== 0) {
      nextDp[j !== 1 ? 0 : 1][j - 1] += dp[0][j];
      nextDp[1][j - 1] += dp[1][j];
      nextDp[j !== 1 ? 2 : 3][j - 1] += dp[2][j];
      nextDp[3][j - 1] += dp[3][j];
    }
    if (j !== maxDigit) {
      nextDp[j !== maxDigit - 1 ? 0 : 2][j + 1] += dp[0][j];
      nextDp[j !== maxDigit - 1 ? 1 : 3][j + 1] += dp[1][j];
      nextDp[2][j + 1] += dp[2][j];
      nextDp[3][j + 1] += dp[3][j];
    }
  }
  for (let j = 0; j < B; j++) {
    nextDp[0][j] %= mod;
    nextDp[1][j] %= mod;
    nextDp[2][j] %= mod;
    nextDp[3][j] %= mod;
  }
  dp = nextDp;
  // console.table(dp);
}

// output
return dp[3].reduce((a, b) => a + b) % mod;
}
