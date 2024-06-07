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
check(`5 7
4 5 1 3 2`,
`3`);
check(`5 13
4 5 1 3 2`,
`-1`);
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
function mergeSort(A, p, r) {
  if (p < r) {
    const q = Math.floor((p + r) / 2);
    mergeSort(A, p, q);
    mergeSort(A, q + 1, r);
    merge(A, p, q, r);
  }
}

const saved = [];
function merge(A, p, q, r) {
  const tmp = [];
  let i = p, j = q + 1, t = 0;
  while (i <= q && j <= r) {
    if (A[i] <= A[j]) tmp[t++] = A[i++];
    else tmp[t++] = A[j++];
  }
  while (i <= q) tmp[t++] = A[i++];
  while (j <= r) tmp[t++] = A[j++];
  i = p, t = 0;
  saved.push(...tmp);
  while (i <= r) A[i++] = tmp[t++];
}
mergeSort(A, 0, N - 1);

// output
return saved.length > K ? saved[K - 1] : -1;
}
