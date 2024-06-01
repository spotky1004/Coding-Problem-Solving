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
check(`4 3`, `4`);
check(`0 0`, `0`);
check(`1152921504606846975 1152921504606846975`, `499791890`);
check(`4 7`, `5`);
check(`7 7`, `12`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, M]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(BigInt));

// code
const mod = 998_244_353n;

const preClacPopCount = [0n];
for (let i = 0n; i <= 65n; i++) {
  const bitVal = 1n << i;
  let count = M & bitVal ? bitVal : 0n;
  if (i !== 0n) count += 2n * preClacPopCount[i];
  preClacPopCount.push(count % mod);
}
// console.log(preClacPopCount);

function S(n) {
  if (n === 0n) return 0n;

  let maxBit = 0n;
  while (n >= (1n << (maxBit + 1n))) maxBit++;
  const maxBitVal = 1n << maxBit;
  let out = preClacPopCount[maxBit] + S(n % maxBitVal);
  if (M & maxBitVal) out += n - (maxBitVal - 1n);
  // console.log(n, maxBit, preClacPopCount[maxBit] + S(n % maxBitVal), n - maxBitVal, out);
  return out % mod;
}

// output
return S(N);
}
