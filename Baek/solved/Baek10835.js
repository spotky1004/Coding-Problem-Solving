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
3 2 5
2 4 1`,
`7`);
check(`4
1 2 3 4
4 1 2 3`,
`6`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], A, B] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const dp = Array.from({ length: N + 1 }, _ => Array(N + 1).fill(-Infinity));
dp[0][0] = 0;
let maxScore = 0;
for (let r = 0; r <= N; r++) {
  const rVal = B[r];
  for (let l = 0; l <= N; l++) {
    const lVal = A[l];

    if (l === N || r === N) {
      maxScore = Math.max(maxScore, dp[l][r]);
      continue;
    }

    dp[l + 1][r] = Math.max(
      dp[l + 1][r],
      dp[l][r]
    );
    dp[l + 1][r + 1] = Math.max(
      dp[l + 1][r + 1],
      dp[l][r]
    );
    if (lVal > rVal) dp[l][r + 1] = Math.max(
      dp[l][r + 1],
      dp[l][r] + rVal
    );
  }
}

// output
return maxScore;
}
