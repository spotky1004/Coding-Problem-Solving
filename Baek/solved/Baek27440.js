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
check(`2`, `1`);
check(`10`, `3`);
check(`3`, `1`);
check(`221`, `8`);
check(`238974`, `19`);
check(`39291`, `16`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
let [[N]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(BigInt));

// code
if (N === 1n) return 0;
const queue = [N];
const counts = new Map();
counts.set(N, 0);
for (const v of queue) {
  const nextCount = counts.get(v) + 1;
  let next;
  if (v % 2n === 0n) {
    next = v / 2n;
    if (next === 1n) return nextCount;
    if (!counts.has(next)) {
      counts.set(next, nextCount);
      queue.push(next);
    }
  }
  if (v % 3n === 0n) {
    next = v / 3n;
    if (next === 1n) return nextCount;
    if (!counts.has(next)) {
      counts.set(next, nextCount);
      queue.push(next);
    }
  }
  next = v - 1n;
  if (next === 1n) return nextCount;
  if (!counts.has(next)) {
    counts.set(next, nextCount);
    queue.push(next);
  }
}

// output
return -1;
}
