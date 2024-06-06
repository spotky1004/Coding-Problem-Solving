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
check(`6
3
3 5
5 5
2 3`,
`9
2
2
1`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], [W], ...events] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const dp = Array.from({ length: W + 1 }, () => Array(W + 1).fill(null));
for (let i = 0; i <= W; i++) dp[i][i] = [Infinity, null, null];
dp[0][0] = [0, null, null];
const carInitialPos = [
  [1, 1],
  [N, N]
];

function calcDist(car, p1, p2) {
  const [x1, y1] = p1 !== 0 ? events[p1 - 1] : carInitialPos[car - 1];
  const [x2, y2] = p2 !== 0 ? events[p2 - 1] : carInitialPos[car - 1];
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function search(p1, p2) {
  if (dp[p1][p2] !== null) return dp[p1][p2][0];

  if (p1 > p2) {
    if (p2 + 1 === p1) {
      let minTime = Infinity;
      let minPrev = null;
      for (let i = 0; i < Math.max(1, p2); i++) {
        const curTime = search(i, p2) + calcDist(1, i, p1);
        if (minTime <= curTime) continue;
        minTime = curTime;
        minPrev = [i, p2];
      }
      dp[p1][p2] = [minTime, 1, minPrev];
    } else {
      dp[p1][p2] = [search(p1 - 1, p2) + calcDist(1, p1 - 1, p1), 1, [p1 - 1, p2]];
    }
  } else {
    if (p1 + 1 === p2) {
      let minTime = Infinity;
      let minPrev = null;
      for (let i = 0; i < Math.max(1, p1); i++) {
        const curTime = search(p1, i) + calcDist(2, i, p2);
        if (minTime <= curTime) continue;
        minTime = curTime;
        minPrev = [p1, i];
      }
      dp[p1][p2] = [minTime, 2, minPrev];
    } else {
      dp[p1][p2] = [search(p1, p2 - 1) + calcDist(2, p2 - 1, p2), 2, [p1, p2 - 1]];
    }
  }
  return dp[p1][p2][0];
}

for (let i = 0; i <= W; i++) {
  for (let j = 0; j <= W; j++) {
    if (i === j) continue;
    search(i, j);
  }
}

let minState = [0, W];
for (let i = 0; i < W; i++) {
  if (dp[i][W][0] < dp[minState[0]][minState[1]][0]) minState = [i, W];
  if (dp[W][i][0] < dp[minState[0]][minState[1]][0]) minState = [W, i];
}

const minTime = dp[minState[0]][minState[1]][0];
let curState = [...minState];
const track = [];
while (true) {
  const [, car, prevState] = dp[curState[0]][curState[1]];
  if (car === null) break;
  track.push(car);
  curState = prevState;
}
track.reverse();

// output
return `${minTime}\n${track.join("\n")}`;
}
