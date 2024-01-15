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
check(`3 2
2 3
1 2`,
`1 2 3`);
check(`6 4
1 2
1 3
2 5
4 5`,
`1 2 2 1 3 1`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, M], ...conds] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const nexts = Array.from({ length: N + 1 }, _ => []);
const lefts = Array(N + 1).fill(0);
for (const [A, B] of conds) {
  nexts[A].push(B);
  lefts[B]++;
}

const minTimes = Array(N + 1).fill(Infinity);
let queue = [];
for (let i = 1; i <= N; i++) {
  if (lefts[i] === 0) {
    minTimes[i] = 1;
    queue.push(i);
  }
}
for (const item of queue) {
  for (const next of nexts[item]) {
    lefts[next]--;
    if (lefts[next] === 0) {
      queue.push(next);
      minTimes[next] = minTimes[item] + 1;
    }
  }
}

// output
return minTimes.slice(1).join(" ");
}
