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
check(`6 4 1 1 1 1 1 1 1 1 1
0 0 0 0 0 0
0 0 0 0 0 0
0 0 0 0 0 0
0 0 0 0 0 1`,
`8`);
check(`5 3 1 1 1 1 1 1 1 1 1
0 -1 0 0 0
-1 -1 0 1 1
0 0 0 1 1`,
`-1`);
check(`5 3 2 1 1 1 1 1 1 1 1
0 0 0 0 0
0 0 0 0 0
0 0 0 0 0
0 0 0 0 0
0 0 1 0 0
0 0 0 0 0`,
`4`);
check(`5 5 1 1 1 1 1 1 1 1 1
1 1 1 1 1
1 1 1 1 1
1 1 1 1 1
1 1 1 1 1
1 1 1 1 1`,
`0`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [dims, ...rawHyper] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const hyper = rawHyper.flat();
const queue = [];
const dimSizes = [1];
for (let i = 1; i < 11; i++) {
  dimSizes.push(dimSizes[i - 1] * dims[i - 1]);
}
const tomatoCount = dims.reduce((a, b) => a * b);
let badTomatoLeft = tomatoCount;
for (let i = 0; i < tomatoCount; i++) {
  if (hyper[i] === 0) continue;
  if (hyper[i] === 1) {
    queue.push(i);
  }
  badTomatoLeft--;
}
if (badTomatoLeft === 0) return 0;

function getAdj(pos) {
  const curState = Array(11);
  let tmp = pos;
  for (let i = 10; i >= 0; i--) {
    const dimSize = dimSizes[i];
    curState[i] = Math.floor(tmp / dimSize);
    tmp %= dimSize;
  }
  const adj = [];
  for (let i = 0; i < 11; i++) {
    const dimSize = dimSizes[i];
    if (curState[i] !== 0) adj.push(pos - dimSize);
    if (curState[i] !== dims[i] - 1) adj.push(pos + dimSize);
  }
  return adj;
}

let curTime = 0;
for (const u of queue) {
  const adj = getAdj(u);
  curTime = hyper[u];
  for (const v of adj) {
    if (hyper[v] !== 0) continue;
    hyper[v] = curTime + 1;
    queue.push(v);
    badTomatoLeft--;
  }
  if (badTomatoLeft === 0) break;
}

// output
return badTomatoLeft === 0 ? curTime : -1;
}
