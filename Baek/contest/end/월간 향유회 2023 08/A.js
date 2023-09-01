const isWeb = typeof window === "object";
const isDev = isWeb || require("fs").existsSync("C:/users/spotky");

if (!isDev) {
  const input = require("fs").readFileSync("/dev/stdin").toString();
  const out = solve(input);
  console.log(out);
} else {
  let CASE_NR = 1;
  function check(input, answer, caseName=`Case ${CASE_NR}`) {
    CASE_NR++;
    const startTime = new Date().getTime();
    const startMemory = !isWeb ? process.memoryUsage().heapUsed / 1024 : 0;
    const out = solve(input);
    const timeDeltaStr = (new Date().getTime() - startTime).toString();
    const timeDeltaZeroStr = " "+"0".repeat(6 - timeDeltaStr.length);
    const memoryDelta = ((!isWeb ? process.memoryUsage().heapUsed / 1024 : 0) - startMemory).toFixed(0);
    const memoryDeltaZeroStr = " "+"0".repeat(8 - memoryDelta.length);
    if (
      typeof answer === "string" ?
        out.toString() === answer :
        answer.includes(out)
    ) console.log("\x1b[1m%s\x1b[42m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[0m", `${caseName}: `, ` AC `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB");
    else console.log("\x1b[1m%s\x1b[41m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[31m%s\x1b[0m", `${caseName}: `, ` WA `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB\n", out.slice(0, 10000));
  }

// cases
check(`4
2 1 L
-2 -1 R
0 -2 U
0 2 D`,
`9`);
check(`1
1000000000 -1000000000 U`,
`Infinity`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], ...clues] = input
  .trim()
  .split("\n")
  .map(line => line.split(" "));

// code
let maxU = -Infinity;
let minD = Infinity;
let minL = Infinity;
let maxR = -Infinity;

for (const [x, y, type] of clues) {
  if (type === "U") maxU = Math.max(maxU, y);
  else if (type === "D") minD = Math.min(minD, y);
  else if (type === "L") minL = Math.min(minL, x);
  else if (type === "R") maxR = Math.max(maxR, x);
}

const w = minL - maxR - 1;
const h = minD - maxU - 1;
if (!isFinite(w) || !isFinite(h)) return "Infinity";

// output
return BigInt(w) * BigInt(h) + "";
}
