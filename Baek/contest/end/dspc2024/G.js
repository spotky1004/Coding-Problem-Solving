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
check(`30 70`, `6`);
check(`1 1024`, `10`);
check(`3 30000`, `17`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[a, b]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const dp1 = Array(1e6 + 1).fill(Infinity);
const dp2 = Array(1e6 + 1).fill(Infinity);
dp1[a] = 0;
const queue = [[1, a]];
for (const [type, value] of queue) {
  const curCount = type === 1 ? dp1[value] : dp2[value];
  const nexts = [[type, value + 1], [type, value * 2]];
  if (type === 1) nexts.push([2, value * 10]);
  for (const [nextType, nextValue] of nexts) {
    const nextDp = nextType === 1 ? dp1 : dp2;
    if (isFinite(nextDp[nextValue]) || nextValue > 1e6) continue;
    nextDp[nextValue] = curCount + 1;
    queue.push([nextType, nextValue]);
  }
}

// output
return Math.min(dp1[b], dp2[b]);
}
