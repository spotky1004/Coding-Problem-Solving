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
0 10 11
10 0 12
12 13 0
YNN
3`,
`21`);
check(`3
0 2 4
2 0 3
4 3 0
YNN
3`,
`5`);
check(`5
1 10 11 12 13
3 5 17 15 8
15 13 22 3 1
10 22 14 9 3
0 1 3 9 0
NYNNN
5`,
`14`);
check(`3
0 1 2
1 2 3
2 3 4
NNY
2`,
`2`);
check(`7
1 3 0 9 3 2 8
13 28 2 3 8 9 30
9 2 14 19 15 10 23
9 2 8 15 19 23 28
15 19 28 0 13 19 15
9 15 32 19 32 0 14
2 3 19 15 23 15 28
YYNYYNY
4`,
`0`);
check(`1
10
N
0`,
`0`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], ...costs] = input
  .trim()
  .replace(/Y/g, "1")
  .replace(/N/g, "0")
  .split("\n")
  .map(line => line.split(" ").map(Number));

const P = costs.pop()[0];
const defaultState = parseInt(Array.from(costs.pop()[0].toString()).reverse().join("").padEnd(N, "0"), 2);

// code
let ans = Infinity;
const dp = Array(1 << N).fill(Infinity);
dp[defaultState] = 0;
const queue = [defaultState];
for (const state of queue) {
  let curCount = 0;
  for (let i = 0; i < N; i++) curCount += Math.sign(state & (1 << i));
  const newCount = curCount + 1;

  const curCost = dp[state];
  if (P <= curCount) ans = Math.min(ans, curCost);

  for (let i = 0; i < N; i++) {
    if (state & (1 << i)) continue;
    const newState = (1 << i) | state;
    if (!isFinite(dp[newState])) queue.push(newState);

    for (let j = 0; j < N; j++) {
      if (!(state & (1 << j))) continue;
      const newCost = curCost + costs[j][i];
      if (P <= newCount) ans = Math.min(ans, newCost);
      dp[newState] = Math.min(dp[newState], newCost);
    }
  }
}

// output
return isFinite(ans) ? ans : -1;
}
