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
    const startMemory = !isWeb ? process.memoryUsage().heapUsed / 1024 : 0;
    const out = solve(input).toString().trim();
    const timeDeltaStr = (new Date().getTime() - startTime).toString();
    const timeDeltaZeroStr = " "+"0".repeat(6 - timeDeltaStr.length);
    const memoryDelta = ((!isWeb ? process.memoryUsage().heapUsed / 1024 : 0) - startMemory).toFixed(0);
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
1 10
2 20
3 30`,
`0`);
check(`8
1 2
2 1
3 4
4 3
5 6
6 5
7 8
8 7`,
`2`);
check(`5
2 4
3 1
5 6
8 2
7 3`,
`-1`);
check(`4
1 2
1 3
2 4
3 5`,
`1`)
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], ...scores] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const groups = [];
scores.sort((a, b) => (a[0] - b[0]) || (a[1] - b[1]));
for (const [Ai, Bi] of scores) {
  groups.push([1, Ai, Bi]);
  while (groups.length >= 2) {
    const [, maxA, maxB] = groups[groups.length - 2];
    if (maxA < Ai && maxB < Bi) break;
    groups[groups.length - 2][0] += groups[groups.length - 1][0];
    groups[groups.length - 2][1] = Math.max(maxA, Ai);
    groups[groups.length - 2][2] = Math.max(maxB, Bi);
    groups.pop();
  }
}

const groupSizes = groups.map(g => g[0]);
const prefixSum = [];
for (let i = 0; i < groupSizes.length; i++) {
  prefixSum.push((prefixSum[i - 1] ?? 0) + groupSizes[i]);
}

let minImbalance = Infinity;
for (let i = -1; i < prefixSum.length; i++) {
  const a = prefixSum[i] ?? 0;
  const goal = (N - a) / 2;
  let l = i + 1;
  let r = prefixSum.length - 1;
  while (l + 1 < r) {
    const m = Math.floor((l + r) / 2);
    const v = goal - (prefixSum[m] - a);
    if (v > 0) l = m;
    else r = m;
  }

  for (let j = l - 2; j <= l + 2; j++) {
    const b = (prefixSum[j] ?? 0) - a;
    const c = prefixSum[prefixSum.length - 1] - b - a;
    if (a <= 0 || b <= 0 || c <= 0) continue;
    const imbalance = Math.max(a, b, c) - Math.min(a, b, c);
    minImbalance = Math.min(minImbalance, imbalance);
  }
}

// output
return isFinite(minImbalance) ? minImbalance : -1;
}
