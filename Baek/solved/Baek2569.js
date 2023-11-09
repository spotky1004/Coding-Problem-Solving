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
check(`4
10
2
8
5`,
`19`);
check(`5
1
400
100
200
300`,
`1105`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [N, ...w] = input
  .trim()
  .split("\n")
  .map(Number);

// code
const comp = [...w]
  .sort((a, b) => a - b);
const compMap = new Map(
  comp
  .map((v, i) => [v, i])
);

const compW = w.map(wi => compMap.get(wi));

const cycles = [];
const visited = Array(N).fill(false);
for (let i = 0; i < N; i++) {
  if (visited[i]) continue;
  visited[i] = true;

  const cycle = [i];
  let cur = i;
  while (true) {
    cur = compW[cur];
    if (visited[cur]) break;

    visited[cur] = true;
    cycle.push(cur);
  }

  cycles.push(cycle);
}

/** @type {[minWeight: number, length: number][]} */
const cycleStatus = cycles.map(cycle => [Math.min(...cycle.map(v => comp[v])), cycle.length]);
cycleStatus.sort((a, b) => a[0] - b[0]);

let minChange = 0;
for (let i = 0; i < cycles.length; i++) {
  const [min, len] = cycleStatus[i];
  minChange += min * (len - 2);
}
minChange += w.reduce((a, b) => a + b, 0);

const minW = comp[0];
for (let i = 1; i < cycles.length; i++) {
  const [min, len] = cycleStatus[i];
  const mergeDiff =
    minW + min +
    -min * (len - 2) +
    minW * len;
  if (mergeDiff >= 0) continue;
  minChange += mergeDiff;
}

// output
return minChange;
}
