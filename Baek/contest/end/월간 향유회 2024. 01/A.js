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
check(`4 2
URLD`,
`YES`);
check(`3 2
URD`,
`NO`);
check(`4 9999
URRDDLLLUUR`,
`YES`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const lines = input
  .trim()
  .split("\n");
const [N, K] = lines.shift().split(" ").map(Number);
const S = lines.shift();

// code
const deltas = new Map([
  ["U", [-1, 0]],
  ["D", [1, 0]],
  ["L", [0, -1]],
  ["R", [0, 1]]
]);

const loopDelta = [0, 0];
for (const d of S) {
  const [di, dj] = deltas.get(d);
  loopDelta[0] += di;
  loopDelta[1] += dj;
}

const delta = [0, 0];
for (const d of S) {
  const [di, dj] = deltas.get(d);
  delta[0] += di;
  delta[1] += dj;

  if (delta[0] === 0 && delta[1] === 0) return "YES";

  if (
    (
      (loopDelta[0] !== 0 && delta[0] % loopDelta[0] !== 0) ||
      (loopDelta[0] === 0 && delta[0] !== 0)
    ) ||
    (
      (loopDelta[1] !== 0 && delta[1] % loopDelta[1] !== 0) ||
      (loopDelta[1] === 0 && delta[1] !== 0)
    )
  ) continue;

  let x = -delta[0] / loopDelta[0];
  let y = -delta[1] / loopDelta[1];
  if (loopDelta[0] === 0) x = y;
  if (loopDelta[1] === 0) y = x;

  if (
    0 > x || x >= K ||
    x !== y
  ) continue;
  return "YES";
}

// output
return "NO";
}
