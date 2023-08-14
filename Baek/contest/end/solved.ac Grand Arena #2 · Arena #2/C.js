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
    else console.log("\x1b[1m%s\x1b[41m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[31m%s\x1b[0m", `${caseName}: `, ` WA `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB\n", out);
  }

// cases
check(`6
31 41 51 92 65 3`,
`40`);
check(`6
1 2 3 4 5 6`,
`2`);
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
let minDiff = Infinity;

A.sort((a, b) => a - b);
let biggest = A[N - 1];
for (let i = 0; i < N; i++) {
  while (
    Math.abs(biggest - A[i]) > Math.abs(biggest - A[i] * 2) &&
    biggest > A[i] * 2
  ) {
    A[i] *= 2;
  }
}

A.sort((a, b) => a - b);
minDiff = Math.min(minDiff, A[N - 1] - A[0]);
for (let i = 0; i < N - 1; i++) {
  if (
    Math.abs(biggest - A[i]) < Math.abs(biggest - A[i] * 2)
  ) break;
  A[i] *= 2;
  biggest = A[i];
  minDiff = Math.min(minDiff, A[i] - A[i + 1]);
}

// output
return minDiff;
}
