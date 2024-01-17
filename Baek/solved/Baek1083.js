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
check(`7
10 20 30 40 50 60 70
1`,
`20 10 30 40 50 60 70`);
check(`5
3 5 1 2 4
2`,
`5 3 2 1 4`);
check(`10
19 20 17 18 15 16 13 14 11 12
5`,
`20 19 18 17 16 15 14 13 12 11`);
check(`5
5 3 4 7 2
2`,
`5 7 3 4 2`);
check(`2
999999 1000000
1000000`,
`1000000 999999`);
check(`10
1 2 3 4 5 6 7 8 9 10
17`,
`10 9 1 2 3 4 5 6 7 8`);
check(`10
1 2 3 4 5 6 7 8 9 10
11`,
`10 3 1 2 4 5 6 7 8 9`);
check(`6
5 4 3 3 4 5
2`,
`5 4 4 3 3 5`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], A, [S]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
let swapLeft = S;
while (swapLeft > 0) {
  /** @type {[value: number, idx: number, newIdx: number][]} */
  const moveables = [];
  for (let i = 1; i < N; i++) {
    const ai = A[i];
    if (ai < (A[i - 1] ?? Infinity)) continue;
    for (let j = i - 1; j >= 0; j--) {
      if (A[j] < ai && j !== 0) continue;
      const l = Math.max(i - swapLeft, j + (A[j] >= ai));
      if (i <= l) break;
      moveables.push([ai, i, l]);
      break;
    }
  }

  moveables.sort((a, b) => (a[2] - b[2]) || (b[0] - a[0]) || (a[1] - b[1]));

  if (moveables.length === 0) break;

  const [v, r, l] = moveables[0];
  swapLeft -= r - l;
  for (let i = r; i >= l; i--) {
    A[i] = A[i - 1];
  }
  A[l] = v;
}

// output
return A.join(" ");
}
