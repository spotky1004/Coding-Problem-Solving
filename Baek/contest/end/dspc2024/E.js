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
check(`10
1 2 3 1 2 3 1 2 3 1
2 5`,
`6`);
check(`5
1 2 3 4 5
9 9`,
`0`);
check(`4
1 2 4 8
-5 -3`,
`9`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[p], values, [a, b]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const sum = values.reduce((a, b) => a + b);
let out = 0;
const aRange = Math.floor(a / p);
const bRange = Math.floor(b / p);
const aOffset = (a - p * aRange + 1e9 * p) % p;
const bOffset = (b - p * aRange + 1e9 * p) % p;
out += sum * Math.max(0, bRange - aRange - 1);
if (aRange === bRange) {
  for (let i = aOffset; i < bOffset; i++) {
    out += values[i];
  }
} else {
  for (let i = aOffset; i < p; i++) {
    out += values[i];
  }
  for (let i = 0; i < bOffset; i++) {
    out += values[i];
  }
}

// output
return out;
}
