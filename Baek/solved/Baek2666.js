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
check(`7
2 5
4
3
1
6
5`,
`5`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
let [[N], opened, [Q], ...toUse] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));
toUse = toUse.flat();

// code
function searchMinMove(from, to) {
  const [l1, r1] = from.sort((a, b) => a - b);
  const [l2, r2] = to.sort((a, b) => a - b);
  if (l1 === r1 || l2 === r2) return Infinity;
  return Math.abs(l1 - l2) + Math.abs(r1 - r2);
}

let cur = toUse[0];
let dp = Array.from({ length: N + 1 }, (_, i) => i !== 0 ? searchMinMove(opened, [cur, i]) : Infinity);
for (let i = 1; i < Q; i++) {
  const next = toUse[i];
  const newDp = Array(N + 1).fill(Infinity);
  for (let j = 1; j <= N; j++) {
    for (let k = 1; k <= N; k++) {
      newDp[k] = Math.min(newDp[k], dp[j] + searchMinMove([cur, j], [next, k]));
    }
  }
  cur = next;
  dp = newDp;
}

// output
return Math.min(...dp);
}
