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
100 70 90 10
30 55 10 8 100
60 10 10 2 70
10 80 50 0 50
40 30 30 8 60
60 10 70 2 120
20 70 50 4 4`,
`134
2 4 6`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], m, ...ings] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
/**
 * @param {number} n 
 * @param {(comb: number[]) => void} callback 
 */
function bruteSearcher(n, callback) {
  const comb = [];
  function impl(i = 0) {
    callback(comb);
    if (i >= n) return;
    impl(i + 1);
    comb.push(i);
    impl(i + 1);
    comb.pop();
  }
  impl();
}

function compArr(a, b) {
  const minLen = Math.min(a.length, b.length);
  for (let i = 0; i < minLen; i++) {
    if (a[i] < b[i]) return -1;
    if (a[i] > b[i]) return 1;
  }
  return Math.sign(a.length - b.length);
}



let minCost = Infinity;
let minIngUsed = null;
bruteSearcher(N, (used) => {
  let cost = 0;
  let val = [0, 0, 0, 0];
  for (const idx of used) {
    cost += ings[idx][4];
    for (let i = 0; i < 4; i++) val[i] += ings[idx][i];
  }

  const ingUsed = used.map(v => v + 1);
  if (
    cost > minCost ||
    val.some((v, i) => v < m[i]) ||
    (cost === minCost && compArr(minIngUsed, ingUsed) === -1)
  ) return;
  minCost = cost;
  minIngUsed = ingUsed;
});

// output
return minIngUsed !== null ? `${minCost}\n${minIngUsed.join(" ")}` : -1;
}
