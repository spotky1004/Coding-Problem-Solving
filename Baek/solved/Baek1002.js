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
check(`3
0 0 13 40 0 37
0 0 3 0 7 4
1 1 1 1 1 5`,
`2
1
0`);
check(`1
0 0 1 1 1 2
-4484 -7336 1134 516 -1204 9046
0 0 5 0 1 2
0 0 1 0 0 1
0 0 1 1 2 1
0 0 1 2 2 2
0 2 2 0 1 1`,
`2
2
0
-1
0
2
1`)
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[T], ...cases] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const out = [];
for (const [x1, y1, r1, x2, y2, r2] of cases) {
  const distPow = (x1 - x2)**2 + (y1 - y2)**2;
  const rSumPow = (r1 + r2)**2;
  if (distPow === 0) {
    if (r1 === r2) {
      out.push(-1);
    } else {
      out.push(0);
    }
  } else if (
    distPow > rSumPow ||
    r1 + Math.sqrt(distPow) < r2 ||
    r2 + Math.sqrt(distPow) < r1
  ) {
    out.push(0);
  } else if (
    distPow === rSumPow ||
    Math.abs(r1 + Math.sqrt(distPow) - r2) < 0.0000001 ||
    Math.abs(r2 + Math.sqrt(distPow) - r1) < 0.0000001
  ) {
    out.push(1);
  } else {
    out.push(2);
  }
}

// output
return out.join("\n");
}
