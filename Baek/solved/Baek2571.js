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
3 7
15 7
5 2`,
`120`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], ...papers] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const SIZE = 100;
const wangPaper = Array.from({ length: SIZE }, _ => Array(SIZE).fill(0));
for (const [sx, sy] of papers) {
  for (let x = sx + 9; x >= sx; x--) {
    for (let y = sy + 9; y >= sy; y--) {
      wangPaper[y][x] = 1;
    }
  }
}

const prefixWangPaper = Array.from({ length: SIZE }, _ => Array(SIZE).fill(0));
for (let y = 0; y < SIZE; y++) {
  let acc = 0;
  for (let x = 0; x < SIZE; x++) {
    const value = wangPaper[y][x];
    if (value === 0) acc = 0;
    else acc++;
    prefixWangPaper[y][x] = acc;
  }
}

let maxArea = 0;
for (let x = 0; x < SIZE; x++) {
  const col = [];
  for (let y = 0; y < SIZE; y++) {
    col.push(prefixWangPaper[y][x]);
  }

  for (let i = 0; i < SIZE; i++) {
    let width = col[i];
    for (let j = i; j < SIZE; j++) {
      width = Math.min(width, col[j]);
      maxArea = Math.max(maxArea, (j - i + 1) * width);
    }
  }
}

// output
return maxArea;
}
