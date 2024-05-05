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
check(`1 4`, `32`);
// check(`10 5`, `8`);
// check(`100 7`, `3`);
// check(`3 28`, `252698795`);
// check(`11 128`, `856188165`);
// check(`1 26`, `872415232`);
// check(`876 128`, `530649653`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[k, b]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(BigInt));

// code
const mod = 1_000_000_007n;
let max = 0n;
let acc = 0n;
let mul = 0n;
let ans = 0n;
for (let i = 0n; i < b; i++) {
  max = 2n * max + 1n;
  acc *= 2n;
  ans = (2n * ans) % mod;

  if (acc + k <= max) acc += k;
  let tmp = acc;
  while (tmp > 0n) {
    ans += tmp % 2n;
    tmp /= 2n;
  }
  console.log(acc, ans);
}

// output
return ans % mod;
}
