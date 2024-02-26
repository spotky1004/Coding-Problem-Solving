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
check(`16 24`, `21`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[n, m]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(BigInt));

// code
/**
 * @param {bigint} a 
 * @param {bigint} b 
*/
function gcd(a, b) {
  return b ? gcd(b, a%b) : a;
}

/**
 * @template {number | bigint} T 
 * @param {T[][]} a 
 * @param {T[][]} b 
 * @param {T} mod 
 * @returns {T[][]} 
*/
function matrixMult2x2(a, b, mod) {
  return [
    [
      (a[0][0] * b[0][0] + a[0][1] * b[1][0]) % mod,
      (a[0][0] * b[0][1] + a[0][1] * b[1][1]) % mod
    ],
    [
      (a[1][0] * b[0][0] + a[1][1] * b[1][0]) % mod,
      (a[1][0] * b[0][1] + a[1][1] * b[1][1]) % mod
    ]
  ];
}

/**
 * @param {bigint} n 
 * @param {bigint} mod 
 */
function calcFib(n, mod) {
  let fibMat = [
    [1n, 0n],
    [0n, 1n]
  ];
  let mul = [
    [1n, 1n],
    [1n, 0n]
  ];
  let bin = 1n;
  while (bin <= n) {
    if ((n & bin) !== 0n) {
      fibMat = matrixMult2x2(fibMat, mul, mod);
    }
    mul = matrixMult2x2(mul, mul, mod);
    bin *= 2n;
  }

  return fibMat[1][0];
}



const mod = 1_000_000_007n;

// output
return calcFib(gcd(n, m), mod);
}
