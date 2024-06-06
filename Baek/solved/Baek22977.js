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
check(`12
-8 0
-8 3
-5 3
-5 2
-2 2
-2 7
6 7
6 5
2 5
2 2
8 2
8 0`,
`24`);
check(`6
0 0
0 500000000
-500000000 500000000
-500000000 1000000000
500000000 1000000000
500000000 0`,
`3000000000`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
let [[N], ...p] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));
N += 2;
p.unshift([-2e9, 0]);
p.push([2e9, 0]);

// code
// right, up, left, down
const dirs = [[], [], [], []];
for (let i = 1; i < N; i++) {
  const s = p[i - 1], e = p[i];
  if (s[0] < e[0]) dirs[0].push(i);
  if (s[1] < e[1]) dirs[1].push(i);
  if (s[0] > e[0]) dirs[2].push(i);
  if (s[1] > e[1]) dirs[3].push(i);
}

let out = 0;
for (const i of dirs[1]) out += p[i][1] - p[i - 1][1];
for (const i of dirs[2]) out += p[i - 1][0] - p[i][0];

// output
return 2 * out;
}
