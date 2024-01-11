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
check(`4
0 10 15 20
5 0 9 10
6 13 0 12
8 8 9 0`,
`35`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], ...table] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const dp = Array.from({ length: N }, _ => Array(1 << N).fill(Infinity));
for (let i = 0; i < N; i++) dp[i][0] = 0;

const queue = Array.from({ length: N }, (_, i) => [i, 0]);
for (const [pos, mask] of queue) {
  for (let i = 0; i < N; i++) {
    const bit = 1 << i;
    if (
      (mask & bit) !== 0 ||
      pos === mask ||
      
    ) continue;

    const newMask = mask | bit;
    if (!isFinite(dp[i][newMask])) queue.push([i, newMask]);
    dp[i][newMask] = Math.min(dp[i][newMask], dp[pos][mask] + table[pos][i]);
  }
}

console.log(dp);

let minCost = Infinity;
for (let i = 0; i < N; i++) {
  minCost = Math.min(minCost, dp[i][(1 << N) - 1]);
}

// output
return minCost;
}
