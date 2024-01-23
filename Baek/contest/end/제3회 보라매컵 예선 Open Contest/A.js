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
123`,
`1`);
check(`3
873`,
`2`);
check(`5
51324`,
`2`);
check(`6
560010`,
`3`);
check(`1
1`,
`1`);
check(`20
11111111111111111111`,
`7`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [N, S] = input
  .trim()
  .split("\n");

// code
const dp = Array(Number(N) + 1).fill(0);
const isVaild = (x) => !x.startsWith("0") && 1 <= Number(x) && Number(x) <= 641;
for (let i = 1; i <= N; i++) {
  let min = Infinity;
  if (i >= 1 && isVaild(S.slice(i - 1, i))) {
    min = Math.min(min, dp[i - 1] + 1);
  }
  if (i >= 2 && isVaild(S.slice(i - 2, i))) {
    min = Math.min(min, dp[i - 2] + 1);
  }
  if (i >= 3 && isVaild(S.slice(i - 3, i))) {
    min = Math.min(min, dp[i - 3] + 1);
  }
  dp[i] = min;
}

// output
return dp[N];
}
