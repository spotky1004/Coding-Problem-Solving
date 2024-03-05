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
check(`5 2 3`, `1`);
check(`30 10 3`, `0`);
check(`30 3 3`, `1`);
check(`100 45 7`, `0`);
check(`100 45 13`, `2`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, K, M]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(BigInt));

// code
/**
 * @param {bigint} to
 * @param {bigint} mod
*/
function genFactroialMod(to, mod) {
  const arr = [1n];
  let out = 1n;
  for (let i = 1n; i <= to; i++) {
    out = (out*i) % mod;
    arr.push(out);
  }

  return arr;
}

/**
 * @param {bigint} a 
 * @param {bigint} b 
 * @param {bigint} p
*/
function divAndPow(a, b, p) {
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

/**
 * @param {bigint} n 
 * @param {bigint} r 
 * @param {bigint} p
 * @param {bigint[]} factroials
*/
function combination(n, r, p, factroials) {
  if (n < r) return 0n;
  return factroials[n] * divAndPow(factroials[n - r] * factroials[r], p - 2n, p) % p;
}



const factMod = genFactroialMod(M, M);
let ans = 1n;
let Np = N, Kp = K;
while (Np > 0n && Kp > 0n) {
  const Ni = Np % M, Ki = Kp % M;
  Np /= M;
  Kp /= M;
  ans = (ans * combination(Ni, Ki, M, factMod)) % M;
}

// output
return ans.toString();
}
