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
check(`2
1 2 3 4 5 6`,
`36`);
check(`3
1 2 3 4 5 6`,
`69`);
check(`1000000
50 50 50 50 50 50`,
`250000000000000`);
check(`10
1 1 1 1 50 1`,
`500`);
check(`1
1 1 1 1 1 1`,
`5`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], [A, B, C, D, E, F]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
if (N === 1) {
  return [A, B, C, D, E, F]
    .sort((a, b) => a - b)
    .slice(0, 5)
    .reduce((a, b) => a + b, 0);
}

const oneMin = Math.min(A, B, C, D, E, F);
const twoMin = Math.min(
  A + B, A + C, A + D, A + E,
  B + C, B + D, B + F,
  C + E, C + F,
  D + E, D + F,
  E + F
);
const threeMin = Math.min(
  A + B + C, A + B + D, A + D + E, A + C + E,
  B + C + F, B + D + F,
  C + E + F,
  D + E + F
);

const oneCount = 5 * (N - 2)**2 + 4 * (N - 2);
const twoCount = 8 * (N - 2) + 4;
const threeCount = 4;

const minScore =
  oneMin * oneCount +
  twoMin * twoCount +
  threeMin * threeCount;

// output
return minScore;
}
