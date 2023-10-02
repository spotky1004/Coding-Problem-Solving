const isWeb = typeof window === "object";
const isDev = isWeb || require("fs").existsSync("C:/users/spotky");

if (!isDev) {
  const input = require("fs").readFileSync("/dev/stdin").toString();
  const out = solve(input);
  console.log(out);
} else {
  require('node:v8').setFlagsFromString('--stack-size=65536');

  let CASE_NR = 1;
  function check(input, answer, caseName=`Case ${CASE_NR}`) {
    CASE_NR++;
    const startTime = new Date().getTime();
    const startMemory = !isWeb ? process.memoryUsage().heapUsed / 1024 : 0;
    const out = solve(input).toString();
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
check(`3 4
SRW`,
`0`);
check(`3 1
SSS`,
`0`);
check(`3 2
SSS`,
`1`);
check(`3 3
SSS`,
`2`);
check(`4 4
SSSS`,
`-1`);
check(`10 3
SSRRWWSSRR`,
`5`);
check(`10 3
SSSSSSSSSS`,
`6`);
check(`8 3
SSSSWWWW`,
`4`);
check(`6 3
SSSWWW`,
`4`);
check(`1 5
S`,
`0`);
check(`2 5
SS`,
`1`);
check(`3 5
SSS`,
`2`);
check(`9 3
SRRSRRSRR`,
`3`);
check(`12 3
SRRWRSRRWRSR`,
`7`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const lines = input
  .trim()
  .split("\n");

const [N, H] = lines[0].split(" ").map(Number);
const items = Array.from(lines[1]);

// code
if (H >= 4) {
  if (N >= 4) return -1;
  return N - (new Set(items).size);
}
if (H === 1) return 0;

if (H === 2) {
  let changeCount = 0;
  let prev = "";
  let sameCount = 0;
  for (let i = 0; i < N; i++) {
    const cur = items[i];
    if (prev !== cur) {
      sameCount = 0;
      prev = cur;
    } else {
      sameCount++;
      if (sameCount % 2 !== 0) {
        changeCount++;
      }
    }
  }
  return changeCount;
} else if (H === 3) {
  let minChangeCount = Infinity;
  const seqs = [
    "SWR", "SRW",
    "WRS", "WSR",
    "RSW", "RWS"
  ];
  for (const seq of seqs) {
    let changeCount = 0;
    for (let i = 0; i < N; i++) {
      if (seq[i % 3] !== items[i]) changeCount++;
    }
    minChangeCount = Math.min(minChangeCount, changeCount);
  }
  return minChangeCount;
}

return -1;
}
