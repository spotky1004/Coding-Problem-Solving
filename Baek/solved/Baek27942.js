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
check(`6
3 2 5 -1 9 3
1 0 1 2 3 2
-2 2 0 0 0 1
-4 4 0 0 5 -2
9 2 -2 3 1 2
-8 2 1 -2 1 3`,
`49
LRUUDLR`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], ...board] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const prefixSum = [];
for (let i = 0; i < N; i++) {
  const row = [board[i][0]];
  prefixSum.push(row);
  for (let j = 1; j < N; j++) row.push(row[j - 1] + board[i][j]);
  if (i !== 0) for (let j = 0; j < N; j++) row[j] += prefixSum[i - 1][j];
}

function sum(x1, y1, x2, y2) {
  let out = prefixSum[y2][x2];
  if (x1 !== 0 || y1 !== 0) {
    if (x1 !== 0) out -= prefixSum[y2][x1 - 1];
    if (y1 !== 0) out -= prefixSum[y1 - 1][x2];
  }
  if (x1 !== 0 && y1 !== 0) out += prefixSum[y1 - 1][x1 - 1];
  return out;
}

let x1 = (N / 2) - 1, y1 = (N / 2) - 1, x2 = x1 + 1, y2 = y1 + 1;
let curValue = 0;
let moves = "";
while (true) {
  let maxNewValue = curValue;
  let maxDirection = "";
  if (y1 !== 0) {
    const newValue = sum(x1, y1 - 1, x2, y2);
    if (newValue > maxNewValue) {
      maxNewValue = newValue;
      maxDirection = "U";
    }
  }
  if (y2 !== N - 1) {
    const newValue = sum(x1, y1, x2, y2 + 1);
    if (newValue > maxNewValue) {
      maxNewValue = newValue;
      maxDirection = "D";
    }
  }
  if (x1 !== 0) {
    const newValue = sum(x1 - 1, y1, x2, y2);
    if (newValue > maxNewValue) {
      maxNewValue = newValue;
      maxDirection = "L";
    }
  }
  if (x2 !== N - 1) {
    const newValue = sum(x1, y1, x2 + 1, y2);
    if (newValue > maxNewValue) {
      maxNewValue = newValue;
      maxDirection = "R";
    }
  }

  if (maxNewValue === curValue) break;
  if (maxDirection === "U") y1--;
  if (maxDirection === "D") y2++;
  if (maxDirection === "L") x1--;
  if (maxDirection === "R") x2++;
  curValue = maxNewValue;
  moves += maxDirection;
}

// output
return `${curValue}\n${moves}`;
}
