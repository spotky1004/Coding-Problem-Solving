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
check(`4 6
1 2
3 1
2 3
4 2
4 1
3 4`,
`4`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, M], ...edges] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const incAdj = Array.from({ length: N }, () => []);
const decAdj = Array.from({ length: N }, () => new Set());
for (const [u, v] of edges) {
  if (u > v) {
    incAdj[v - 1].push(u - 1);
    decAdj[u - 1].add(v - 1);
  } else {
    incAdj[u - 1].push(v - 1);
    decAdj[v - 1].add(u - 1);
  }
}

let from = Array.from({ length: N }, (_, i) => [i]);
for (let i = 0; i < 2; i++) {
  const newFrom = Array.from({ length: N }, () => []);
  for (let u = 0; u < N; u++) {
    for (const v of incAdj[u]) {
      for (const w of from[u]) {
        newFrom[v].push(w);
      }
    }
  }
  from = newFrom;
}

let count = 0;
for (let v = 0; v < N; v++) {
  const dec = decAdj[v];
  for (const w of from[v]) {
    if (dec.has(w)) count++;
  }
}

// output
return count;
}
