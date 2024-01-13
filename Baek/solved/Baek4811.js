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
check(`6
1
4
2
3
30
0`,
`132
1
14
2
5
3814986502092304`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [...cases] = input
  .trim()
  .split("\n")
  .map(Number);

// code
const cache = Array(31).fill(null);
function solveFor(n) {
  if (cache[n] !== null) return cache[n];

  const subCache = new Map();
  subCache.set(0, 1);
  function subSolveFor(fullPill, halfPill) {
    const key = fullPill * n + halfPill;
    if (subCache.has(key)) return subCache.get(key);

    let ans = 0;
    if (fullPill > 0) ans += subSolveFor(fullPill - 1, halfPill + 1);
    if (halfPill > 0) ans += subSolveFor(fullPill, halfPill - 1);
    subCache.set(key, ans);
    
    return ans;
  }

  const ans = subSolveFor(n, 0);
  cache[n] = ans;
  return ans;
}

const out = [];
for (const N of cases) {
  if (N === 0) break;
  out.push(solveFor(N));
}

// output
return out.join("\n");
}
