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
check(`3 15
6
-3
1`,
`25`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[n, m], ...x] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const poses = x.flat().sort((a, b) => a - b);
const lPoses = [];
const rPoses = [0];
for (const pos of poses) {
  if (pos < 0) lPoses.push(pos);
  else if (pos > 0) rPoses.push(pos);
}
lPoses.push(0);
lPoses.reverse();

const dp = Array.from({ length: lPoses.length }, () => Array.from({ length: rPoses.length }, () => [[0, -1], [0, -1]]));
dp[0][0][0][1] = 0;
dp[0][0][1][1] = 0;
if (poses.includes(0)) {
  dp[0][0][0][0] += m;
  dp[0][0][1][0] += m;
}
console.log(lPoses, rPoses);

/**
 * @param {number} l 
 * @param {number} r 
 * @param {0 | 1} side 
 * @returns {[candies: number, time: number, pos: number]}
 */
function search(l, r, side) {
  const values = dp[l][r][side];
  const curPos = side === 0 ? lPoses[l] : rPoses[r];
  if ([l, r][side] === 0) return [-1, Infinity, curPos];
  if (values[1] !== -1) return [...values, curPos];
  let maxCandies = 0;
  let timeAt = 0;
  const avaiables = [];
  if (l !== 0) {
    avaiables.push(search(l - 1, r, 0));
    avaiables.push(search(l - 1, r, 1));
  }
  if (r !== 0) {
    avaiables.push(search(l, r - 1, 0));
    avaiables.push(search(l, r - 1, 1));
  }
  for (const [candies, time, pos] of avaiables) {
    const newTime = time + Math.abs(curPos - pos);
    const newCandies = candies + Math.max(0, m - newTime);
    if (newCandies < maxCandies) continue;
    if (newCandies === maxCandies) {
      timeAt = Math.min(timeAt, newTime);
    } else {
      maxCandies = newCandies;
      timeAt = newTime;
    }
  }

  values[0] = maxCandies;
  values[1] = timeAt;
  console.log(l, r, side, curPos, maxCandies, timeAt);
  return [...values, curPos];
}
Math.max(
  search(lPoses.length - 1, rPoses.length - 1, 0)[0],
  search(lPoses.length - 1, rPoses.length - 1, 1)[0]
);
console.log(dp[0], dp[1]);

// output
return Math.max(
  search(lPoses.length - 1, rPoses.length - 1, 0)[0],
  search(lPoses.length - 1, rPoses.length - 1, 1)[0]
);
}
