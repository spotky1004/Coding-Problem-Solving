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
check(`1 1
10
10`,
`1 1`);
check(`2 1
20 10
10`,
`1 1`);
check(`2 1
10 10
10`,
`1 1`);
check(`6 3
10 110 120 130 250 350
10 360 370`,
`4 2`);
check(`3 3
1 101 1000000
1 361 1000000`,
`3 3`);
check(`6 6
1 11 56 89 100 101
1 234 238 125 360 361`,
`2 2`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, M], A, B] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
A.sort((a, b) => a - b);
B.sort((a, b) => a - b);

let s1Count = 0;
let s2Count = 0;
let prevUse = -Infinity;
for (const a of A) {
  if (prevUse + 100 > a) continue;
  prevUse = a;
  s1Count++;
}
prevUse = -Infinity;
for (const b of B) {
  if (prevUse + 360 > b) continue;
  prevUse = b;
  s2Count++;
}


// output
return `${s1Count} ${s2Count}`;
}
