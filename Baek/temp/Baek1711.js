const isWeb = typeof window === "object";
const isDev = isWeb || require("fs").existsSync("C:/users/spotky");

if (!isDev) {
  const input = require("fs").readFileSync("/dev/stdin").toString();
  const out = solve(input);
  console.log(out);
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
-1 1
-1 0
0 0
1 0
1 1`,
`7`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], ...points] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(BigInt));

// code
let count = 0;
for (let a = 0n; a < N; a++) {
  const [ax, ay] = points[a];
  for (let b = a + 1n; b < N; b++) {
    const [bx, by] = points[b];
    const x = (ax - bx)**2n + (ay - by)**2n;
    for (let c = b + 1n; c < N; c++) {
      const [cx, cy] = points[c];
      const y = (bx - cx)**2n + (by - cy)**2n;
      const z = (cx - ax)**2n + (cy - ay)**2n;
      if (
        x + y !== z &&
        x + z !== y &&
        y + z !== x
      ) continue;
      count++;
    }
  }
}

// output
return count;
}
