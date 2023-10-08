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
check(`3 5 10
30 7 -1 0 10
10 10 10 10 1
200 -1 0 0 0`,
`1`);
check(`3 5 1
30 7 -1 0 10
10 10 10 10 1
200 -1 0 0 0`,
`0`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, M, P], ...gizis] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(BigInt));

// code
let power = P;
for (const gizi of gizis) {
  const soliders = [];
  let itemCount = 0;
  for (const s of gizi) {
    if (s === -1n) itemCount++;
    else soliders.push(s);
  }
  soliders.sort((a, b) => Number(a - b));

  for (const solider of soliders) {
    while (power < solider && 0 < itemCount) {
      power *= 2n;
      itemCount--;
    }
    if (power < solider) return 0;
    power += solider;
  }
  while (itemCount > 0) {
    power *= 2n;
    itemCount--;
  }
}

// output
return 1;
}
