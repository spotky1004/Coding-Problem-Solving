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
check(`5 17`,
`4
5 10 9 18 17`);
check(`5 17`,
`4
5 4 8 16 17`);
check(`0 0`,
`0
0`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, K]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const MAX_POS = 200000;
const minTimes = Array(MAX_POS + 1).fill(Infinity);
const prevPos = Array(MAX_POS + 1).fill(null);
minTimes[N] = 0;
let queue = [];
let nextQueue = [N];
let t = 0;
while (true) {
  if (nextQueue.length === 0) break;
  queue = nextQueue;
  nextQueue = [];
  for (const pos of queue) {
    for (const j of [pos - 1, pos + 1, pos * 2]) {
      if (isFinite(minTimes[j]) || MAX_POS <= j || 0 > j) continue;
      minTimes[j] = t + 1;
      prevPos[j] = pos;
      nextQueue.push(j);
    }
  }
  t++;
}

const track = [K];
while (true) {
  const prev = prevPos[track[track.length - 1]];
  if (prev === null) break;
  track.push(prev);
}

// output
return `${minTimes[K]}\n${track.reverse().join(" ")}`;
}
