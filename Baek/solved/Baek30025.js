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
check(`10 1 2
0 1 2 3 4 5 6 7 8 9`,
`4`);
check(`5 2 25
0 1 2 5 7`,
`3`);
check(`2 2 2
0 2`,
`2`);
check(`2 30 2
2 4`,
`73741817`);
check(`2 5 5
0 1`,
`8`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, M, K], a] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const avaiables = Array(10).fill(false);
let zeroDp = Array(K).fill(0);
let dp = Array(K).fill(0);
for (const ai of a) {
  avaiables[ai] = true;
  if (ai !== 0) dp[ai % K]++;
  else zeroDp[0]++;
}

const mod = 1_000_000_007;
let exp = 1;
for (let i = 1; i < M; i++) {
  exp = (exp * 10) % K;
  const newDp = Array(K).fill(0);
  for (let j = 1; j <= 9; j++) {
    if (!avaiables[j]) continue;
    for (let k = 0; k < K; k++) {
      newDp[(k + j * exp) % K] += dp[k] + zeroDp[k];
    }
  }
  for (let i = 0; i < K; i++) {
    newDp[i] %= mod;
    if (avaiables[0]) zeroDp[i] += dp[i];
  }
  dp = newDp;
}

// output
return dp[0];
}
