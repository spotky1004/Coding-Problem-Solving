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
check(`3 3
1 0 2
0 0 0
3 0 0
2 3 2`,
`3`);
check(`3 3
1 0 2
0 0 0
3 0 0
1 2 2`,
`0`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, K], ...board] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));
const [S, X, Y] = board.pop();

// code
let closestDist = Infinity;
let closestVirus = null;
for (let i = 0; i < N; i++) {
  for (let j = 0; j < N; j++) {
    const cell = board[i][j];
    if (cell === 0) continue;

    const dist = Math.abs(i - (X - 1)) + Math.abs(j - (Y - 1));
    if (dist > closestDist) continue;
    if (dist !== closestDist) {
      closestVirus = cell;
    } else {
      closestVirus = Math.min(closestVirus, cell);
    }
    closestDist = dist;
  }
}

// output
return closestDist > S ? 0 : closestVirus;
}
