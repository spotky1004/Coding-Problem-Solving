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
check(`5
3 4 12 1 8`,
`4`);
check(`3
1 1 1`,
`0`);
check(`5
1 2 3 2 1`,
`1`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], A] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
/**
 * @param {number[]} arr
*/
function prefixSum(arr) {
  if (arr.length === 0) return [];

  const sumArr = [arr[0]];
  for (let i = 1; i < arr.length; i++) {
    sumArr[i] = sumArr[i - 1] + arr[i];
  }
  return sumArr;
}



const prefixA = prefixSum(A);
const rangeSum = (l, r) => prefixA[r] - (l > 0 ? prefixA[l - 1] : 0);
let count = 0;
for (let X = 0; X < N; X++) {
  const headSize = rangeSum(0, X);
  let Yl, Yr, l, r;

  l = X + 1, r = N;
  while (l + 1 < r) {
    const m = Math.floor((l + r) / 2);
    const abdomenSize = rangeSum(m, N - 1);
    if (headSize < abdomenSize) l = m;
    else r = m;
  }
  Yr = l - 1;
  
  l = X + 1, r = N;
  while (l + 1 < r) {
    const m = Math.floor((l + r) / 2);
    const thoraxSize = rangeSum(X + 1, m - 1);
    const abdomenSize = rangeSum(m, N - 1);
    if (thoraxSize < abdomenSize) l = m;
    else r = m;
  }
  Yl = l;

  count += Math.max(0, Yr - Yl + 1);
}

// output
return count;
}
