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
check(`1
1 1`,
`1`);
check(`3
2 3`,
`702468249`);
check(`1000000
2 3`,
`702468249`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], [p, q]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(BigInt));

// code
/**
 * @param {bigint} a 
 * @param {bigint} b 
 * @param {bigint} p
*/
function powMod(a, b, p) {
  let out = 1n;
  let curMul = a;
  let bin = 1n;
  while (bin <= b) {
    if (b & bin) {
      out = out*curMul % p;
    }
    bin *= 2n;
    curMul = curMul**2n % p;
  }
  return out;
}



const mod = 998_244_353n;

const pdq = p * powMod(q, mod - 2n, mod);
const pdqInv = (mod + 1n - pdq) % mod;

const dp = [pdq];
const numN = Number(N);
for (let i = 1; i < numN; i++) {
  dp[i] = (dp[i - 1] * pdq + (mod + 1n - dp[i - 1]) * pdqInv) % mod;
}

// for (let i)
console.log(dp);

// output
return "answer";
}
