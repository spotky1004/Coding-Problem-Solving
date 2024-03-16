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
    const startMemory = !isWeb ? process.memoryUsage().heapUsed : window.performance.memory.usedJSHeapSize;
    const out = solve(input).toString().trim();
    const timeDeltaStr = (new Date().getTime() - startTime).toString();
    const timeDeltaZeroStr = " "+"0".repeat(6 - timeDeltaStr.length);
    const memoryDelta = (((!isWeb ? process.memoryUsage().heapUsed : window.performance.memory.usedJSHeapSize) - startMemory) / 1024).toFixed(0);
    const memoryDeltaZeroStr = " "+"0".repeat(8 - memoryDelta.length);
    if (
      typeof answer === "string" ?
        out === answer :
        answer.includes(out)
    ) console.log("\x1b[1m%s\x1b[42m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[0m", `${caseName}: `, ` AC `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB");
    else console.log("\x1b[1m%s\x1b[41m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[31m%s\x1b[0m", `${caseName}: `, ` WA `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB\n", out.slice(0, 10000));
  }

// cases
check(`4
1 4 13 40`,
`121`);
check(`5
1 2 3 4 5`,
`6`);
check(`5
3 6 12 24 48`,
`96`);
check(`1
0`,
`A`);
check(`2
-1 2`,
`A`);
check(`2
57 57`,
`57`);
check(`4
16 -8 4 -2`,
`B`);
check(`5
6 5 4 3 1`,
`B`);
check(`4
-12 12 -36 60`,
`-132`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], seq] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
if (N === 1) return "A";

let avaiables = [];
const first = seq[0];
const second = seq[1];
for (let a = -200; a <= 200; a++) {
  avaiables.push([a, second - a * first]);
}

for (let i = 2; i < N; i++) {
  const prev = seq[i - 1];
  const cur = seq[i];
  avaiables = avaiables.filter(([a, b]) => a * prev + b === cur);
}

const ans = new Set();
const last = seq[N - 1];
for (const [a, b] of avaiables) {
  ans.add(a * last + b);
}

// output
if (ans.size === 0) return "B";
if (ans.size > 1) return "A";
return [...ans][0];
}
