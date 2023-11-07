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
check(`3 5 23
-5 0 5
1 6 2 8 10`,
`20.0`);
check(`2 1 100
1 20
5`,
`47.5`);
check(`4 4 5
1 4 10 7
5 16 17 20`,
`-1`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, M, R], A, B] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
A.sort((a, b) => a - b);

let w = [];
for (let i = 0; i < N; i++) {
  for (let j = i + 1; j < N; j++) {
    w.push(A[j] - A[i]);
  }
}
w.sort((a, b) => a - b);

B.sort((a, b) => a - b);
let maxS = -1;

let j = w.length - 1;
for (let i = 0; i < M; i++) {
  const h = B[i];
  while (h * w[j] / 2 > R) j--;
  if (j < 0) break;
  maxS = Math.max(maxS, h * w[j] / 2);
}

let out;
if (maxS === -1) out = -1;
else out = maxS.toFixed(1);

// output
return out;
}
