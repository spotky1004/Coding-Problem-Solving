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
check(`9709171`,
`0`);
check(`457819560`,
`3
107 197
160 70
170 32`);
check(`96807975`,
`2
25 25
95 33`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
let [[S]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
S /= 4763;
let avaiables = [];
for (let a = 0; a <= 200; a++) {
  for (let b = 0; b <= 200; b++) {
    const abScore = a > b ? (a - b) * 508 : (b - a) * 108;
    for (let c = 0; c <= 200; c++) {
      for (let d = 0; d <= 200; d++) {
        const cdScore = c > d ? (c - d) * 212 : (d - c) * 305;
        if (S !== abScore + cdScore) continue;
        avaiables.push([Math.abs(a - b), Math.abs(c - d)]);
      }
    }
  }
}
avaiables = [...new Set(avaiables.sort((a, b) => (a[0] || a[1]) - (b[0] || b[1])).map(v => v.join(" ")))];

// output
return `${avaiables.length}\n${avaiables.join("\n")}`;
}
