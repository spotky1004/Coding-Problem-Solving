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
check(`2 1
1 2`,
`1`);
check(`3 1
1 2`,
`0.5`);
check(`4 3
4 1`,
`0.037037037037`);
check(`3 100
1 1`,
``);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, M], [S, E]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
let dp = Array(N).fill(0);
dp[S - 1] = 1;
for (let i = 0; i < M; i++) {
  const newDp = Array(N).fill(0);
  const changed = Array(N).fill(0);
  for (let j = 1; j < N; j++) {
    newDp[j - 1] += dp[j] / (N - 1);
    newDp[j] += dp[j - 1] / (N - 1);
    changed[j]++, changed[j - 1]++;
  }
  dp = newDp.map((v, i) => v + dp[i] * (N - changed[i] - 1) / (N - 1));
}

// output
return dp[E - 1].toFixed(20);
}
