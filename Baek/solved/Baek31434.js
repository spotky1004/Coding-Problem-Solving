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
check(`2 4
1 2
2 5`,
`6`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, K], ...upgs] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const MAX_S = 50 * K + 1;

const dp = Array(MAX_S + 1).fill(null);
dp[1] = 0;
for (let t = 0; t < K; t++) {
  for (let s = MAX_S; s >= 0; s--) {
    if (dp[s] === null) continue;
    const curCarrot = dp[s];
    for (let i = 0; i < N; i++) {
      const [Ai, Bi] = upgs[i];
      if (curCarrot < Ai) continue;
      dp[s + Bi] = Math.max(dp[s + Bi], curCarrot - Ai);
    }
    dp[s] = Math.max(dp[s], curCarrot + s);
  }
}

// output
return Math.max(...dp.filter(carrot => carrot !== null));
}
