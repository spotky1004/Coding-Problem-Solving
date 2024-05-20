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
OhIkjun 1 6 10000
Hyukjun 1 5 5000
Junseong 2 0 8000
Hyukjun 4000
OhIkjun 12000
Junseong 20000`,
`2`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], ...lines] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(v => !isNaN(parseInt(v)) ? Number(v) : v));
const items = lines.splice(0, N);
const money = new Map(lines);

// code
const avaialbes = Array(100).fill(false);
for (const [S, W, D, P] of items) {
  if (money.get(S) < P) continue;
  avaialbes[7 * W + D] = true;
}

let max = 0;
let cur = 0;
for (let i = 0; i < avaialbes.length; i++) {
  if (!avaialbes[i]) {
    cur = 0;
    continue;
  }
  cur++;
  max = Math.max(max, cur);
}

// output
return max;
}
