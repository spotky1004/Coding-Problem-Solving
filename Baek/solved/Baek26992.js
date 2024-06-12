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
check(`0 0 1 1 1 0 0 1 1 0 1 1 0 0 0 0 0 0 0 0`, `3`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [bowls] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
/**
 * @param {number} n 
 * @param {(comb: number[]) => void} callback 
 */
function combBruteSearcher(n, callback) {
  const maxBit = (1 << n) - 1;
  for (let i = 0; i <= maxBit; i++) {
    const comb = [];
    for (let b = 0; b < n; b++) if (i & (1 << b)) comb.push(b);
    callback(comb);
  }
}



const flipMasks = [];
for (let i = 0; i < 20; i++) {
  let mask = 0;
  for (let j = Math.max(0, i - 1); j <= Math.min(19, i + 1); j++) mask += 1 << j;
  flipMasks.push(mask);
}

let ans = Infinity;
let initState = bowls.reduce((a, b, i) => a + (b ? (1 << i) : 0), 0);
combBruteSearcher(20, comb => {
  let state = initState;
  for (const at of comb) state ^= flipMasks[at];
  if (state !== 0) return;
  ans = Math.min(ans, comb.length);
});

// output
return ans;
}
