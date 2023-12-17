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
check(`5
3 1 4 5 9`,
`7`);
check(`7
20 10 9 11 3 18 1`,
`6`);
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
A.sort((a, b) => a - b);
const diffs = Array(N - 1);
for (let i = 1; i < N; i++) {
  diffs[i - 1] = A[i] - A[i - 1];
}

const half = (N - 1) / 2;
const prefSum1 = Array(half);
prefSum1[-1] = 0;
const prefSum2 = Array(half);
prefSum2[-1] = 0;
for (let i = 0; i < half; i++) {
  prefSum1[i] = prefSum1[i - 1] + diffs[2 * i];
  prefSum2[i] = prefSum2[i - 1] + diffs[2 * i + 1];
}

function rangeSum(arr, a, b) {
  return arr[b] - arr[a - 1];
}

let minSum = Infinity;
for (let i = 2; i < N; i++) {
  let sum;
  const threeSum = A[i] - A[i - 2];
  if (i % 2 === 0) {
    sum =
      rangeSum(prefSum1, 0, i / 2 - 2) +
      threeSum +
      rangeSum(prefSum2, i / 2, half - 1);
  } else {
    sum =
      rangeSum(prefSum1, 0, (i - 1) / 2 - 1) +
      threeSum +
      rangeSum(prefSum2, (i + 1) / 2, half - 1) +
      A[i + 1] - A[i - 3];
  }

  minSum = Math.min(minSum, sum);
}

// output
return minSum;
}
