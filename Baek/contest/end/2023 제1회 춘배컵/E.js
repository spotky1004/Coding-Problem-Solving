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
    const startMemory = !isWeb ? process.memoryUsage().heapUsed / 1024 : 0;
    const out = solve(input).toString().trim();
    const timeDeltaStr = (new Date().getTime() - startTime).toString();
    const timeDeltaZeroStr = " "+"0".repeat(6 - timeDeltaStr.length);
    const memoryDelta = ((!isWeb ? process.memoryUsage().heapUsed / 1024 : 0) - startMemory).toFixed(0);
    const memoryDeltaZeroStr = " "+"0".repeat(8 - memoryDelta.length);
    if (
      typeof answer === "string" ?
        out === answer :
        answer.includes(out)
    ) console.log("\x1b[1m%s\x1b[42m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[0m", `${caseName}: `, ` AC `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB");
    else console.log("\x1b[1m%s\x1b[41m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[31m%s\x1b[0m", `${caseName}: `, ` WA `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB\n", out.slice(0, 10000));
  }

// cases
check(`6
0 1 2 3 2 3`,
`7`);
check(`2
3 3`,
`0`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], presents] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const pCounts = Array(4).fill(0);
for (const p of presents) {
  pCounts[p]++;
}

let score = 0;
let maxCombCount;

maxCombCount = Math.min(pCounts[0], pCounts[3]);
score += 3 * maxCombCount;
pCounts[0] -= maxCombCount;
pCounts[3] -= maxCombCount;

maxCombCount = Math.min(pCounts[1], pCounts[2]);
score += 3 * maxCombCount;
pCounts[1] -= maxCombCount;
pCounts[2] -= maxCombCount;

maxCombCount = Math.min(pCounts[0], pCounts[2]);
score += 2 * maxCombCount;
pCounts[0] -= maxCombCount;
pCounts[2] -= maxCombCount;

maxCombCount = Math.min(pCounts[1], pCounts[3]);
score += 2 * maxCombCount;
pCounts[1] -= maxCombCount;
pCounts[3] -= maxCombCount;

maxCombCount = Math.min(pCounts[0], pCounts[1]);
score += 1 * maxCombCount;
pCounts[0] -= maxCombCount;
pCounts[1] -= maxCombCount;

maxCombCount = Math.min(pCounts[2], pCounts[3]);
score += 1 * maxCombCount;
pCounts[2] -= maxCombCount;
pCounts[3] -= maxCombCount;

// output
return score;
}
