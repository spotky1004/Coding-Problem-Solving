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
check(`4 2
5 4
0 1
0 1 2 5`,
`8`);
check(`5 5
9 2
0 1 2 3 4
0 9`,
`What is that map newbie...`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[T, N], [L, K], t, l] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
let maxGap = 0, maxTerm = 0;
for (let i = 1; i < K; i++) maxGap = Math.max(maxGap, l[i] - l[i - 1] - 1);
for (let i = 1; i < N; i++) maxTerm = Math.max(maxTerm, t[i] - t[i - 1] - 1);
maxTerm = Math.max(maxTerm, T - t[N - 1] - 1);
if (maxGap > maxTerm) return "What is that map newbie...";
let curT = 0;
for (let i = 0; i < K - 1; i++) {
  const curGap = l[i + 1] - l[i] - 1;
}

// output
return "answer";
}
