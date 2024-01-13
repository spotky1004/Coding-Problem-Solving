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
check(`10
10 -4 3 1 5 6 -35 12 21 -1`,
`54`);
check(`5
-1 -1 -1 -1 -1`,
`-1`);
check(`8
1 -3 4 8 -4 -3 9 2`,
`20`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], nums] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
if (nums.every(v => v < 0)) return nums.reduce((a, b) => Math.max(a, b), -Infinity);

let maxVal = 0;
const dp1 = Array(N).fill(0);
const dp2 = Array(N).fill(0);
for (let i = 0; i < N; i++) {
  const num = nums[i];
  dp1[i] = Math.max((dp1[i - 1] ?? 0) + num, num);
  const dp2Val = Math.max((dp1[i - 1] ?? 0) + Math.max(0, num), (dp2[i - 1] ?? 0) + num, num);
  maxVal = Math.max(maxVal, dp2Val);
  dp2[i] = dp2Val;
}

// output
return maxVal;
}
