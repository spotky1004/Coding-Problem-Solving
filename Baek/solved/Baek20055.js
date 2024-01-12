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
check(`3 2
1 2 1 2 1 2`,
`2`);
check(`3 6
10 10 10 10 10 10`,
`31`);
check(`4 5
10 1 10 6 3 4 8 2`,
`24`);
check(`5 8
100 99 60 80 30 20 10 89 99 100`,
`472`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, K], A] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
let startPos = 0;
let endPos = N - 1;
let brokenCount = 0;
const robots = Array(N - 1).fill(false);
let stage = 0;
while (brokenCount < K) {
  stage++;

  startPos = (startPos + 2 * N - 1) % (2 * N);
  endPos = (endPos + 2 * N - 1) % (2 * N);
  robots.pop();
  robots.unshift(false);

  for (let i = N - 2; i >= 0; i--) {
    const curPos = (startPos + i) % (2 * N);
    const nextPos = (curPos + 1) % (2 * N);
    if (
      !robots[i] ||
      robots[i + 1] ||
      A[nextPos] === 0
    ) continue;

    A[nextPos]--;
    if (A[nextPos] === 0) brokenCount++;

    robots[i] = false;
    if (nextPos !== endPos) robots[i + 1] = true;
  }

  if (A[startPos] !== 0) {
    robots[0] = true;
    A[startPos]--;
    if (A[startPos] === 0) brokenCount++;
  }
}

// output
return stage;
}
