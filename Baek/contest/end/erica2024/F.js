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
check(`2
8
0 1 18
0 2 20
0 2 15
1 0 10
1 2 15
2 0 13
2 2 10
2 1 5`,
`46`);
check(`2
4
0 1 18
0 2 20
1 0 10
1 2 15`,
`-1`);
check(`1
2
0 1 100
1 0 100`,
`200`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], [M], ...edges] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const goal = (1 << (N + 1)) - 1;
const dp = Array.from({ length: goal + 1 }, () => Array(N + 1).fill(-1));
const adjInv = Array.from({ length: N + 1 }, () => Array(N + 1).fill(-Infinity));
for (const [ui, vi, di] of edges) {
  if (ui === vi) continue;
  adjInv[vi][ui] = Math.max(adjInv[vi][ui], di);
  if (ui === 0) dp[1 << vi][vi] = Math.max(dp[1 << vi][vi], di);
}

function search(mask, v) {
  const bit = 1 << v;
  if ((mask & bit) === 0) return -Infinity;
  if (dp[mask][v] !== -1) return dp[mask][v];

  const subMask = mask ^ bit;
  let maxTime = -Infinity;
  for (let u = 0; u <= N; u++) {
    if ((subMask & (1 << u)) === 0) continue;
    const w = adjInv[v][u];
    maxTime = Math.max(maxTime, search(subMask, u) + w);
  }

  dp[mask][v] = maxTime;
  return maxTime;
}
search(goal, 0);
// console.log(dp);

const ans = dp[goal][0];
// output
return isFinite(ans) ? ans : -1;
}
