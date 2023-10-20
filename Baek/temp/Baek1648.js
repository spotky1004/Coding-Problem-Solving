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
check(`3 6`,
`41`);
check(`5 5`,
`0`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, M]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const mod = 9901;

if (N % 2 === 1 && M % 2 === 1) return 0;

let width, height;
if (N % 2 === 0) {
  width = N;
  height = M;
} else {
  width = M;
  height = N;
}

// y: 0 ~ y - 1 filled, x: 0 ~ x - 1 filled
const dp = Array.from({ length: height }, _ => Array(width).fill(0));
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    if (1 <= x) {
      dp[y][x] = (dp[y][x] + (dp[y][x - 2] ?? 0) + 1) % mod;
    }
    if (1 <= y) {
      dp[y][x] = (dp[y][x] + ((dp[y - 2] ?? [])[x] ?? 0) + 1) % mod;
    }
  }
}

console.table(dp);


// output
return dp[height - 1][width - 1];
}
