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
check(`5 17`, `2`);
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
const MAX_POS = 200001;
const moveCounts = Array(MAX_POS).fill(Infinity);
moveCounts[N] = 0;
let queue = [];
let nextQueue = [N];
let i = 0;
while (true) {
  if (nextQueue.length === 0) break;
  queue = nextQueue;
  nextQueue = [];
  for (const pos of queue) {
    if (moveCounts[pos] !== i || pos < 0 || pos >= MAX_POS) continue;

    if (pos !== 0) {
      for (let j = pos; j <= MAX_POS; j *= 2) {
        if (moveCounts[j] <= i) continue;
        moveCounts[j] = i;
        queue.push(j);
      }
    }
    
    for (const j of [pos - 1, pos + 1]) {
      if (moveCounts[j] <= i + 1) continue;
      moveCounts[j] = i + 1;
      nextQueue.push(j);
    }
  }
  i++;
}

// output
return moveCounts[K];
}