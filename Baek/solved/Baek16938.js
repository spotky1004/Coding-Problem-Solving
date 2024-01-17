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
check(`3 5 6 1
1 2 3`,
`2`);
check(`4 40 50 10
10 20 30 25`,
`2`);
check(`5 25 35 10
10 10 20 10 20`,
`6`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, L, R, X], A] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
let count = 0;
const MAX = (1 << N) - 1;
for (let mask = 3; mask <= MAX; mask++) {
  let qCount = 0;
  let sum = 0;
  let min =  Infinity;
  let max = -Infinity;
  for (let i = 0; i < N; i++) {
    if ((mask & (1 << i)) === 0) continue;
    const ai = A[i];
    min = Math.min(min, ai);
    max = Math.max(max, ai);
    sum += ai;
    qCount++;
  }
  
  if (
    qCount === 1 ||
    L > sum || sum > R ||
    max - min < X
  ) continue;
  count++;
}

// output
return count;
}
