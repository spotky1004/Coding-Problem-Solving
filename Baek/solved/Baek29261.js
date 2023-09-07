const isWeb = typeof window === "object";
const isDev = isWeb || require("fs").existsSync("C:/users/spotky");

if (!isDev) {
  const input = require("fs").readFileSync("/dev/stdin").toString();
  const out = solve(input);
  console.log(out);
} else {
  require('node:v8').setFlagsFromString('--stack-size=65536');

  let CASE_NR = 1;
  function check(input, answer, caseName=`Case ${CASE_NR}`) {
    CASE_NR++;
    const startTime = new Date().getTime();
    const startMemory = !isWeb ? process.memoryUsage().heapUsed / 1024 : 0;
    const out = solve(input).toString();
    const timeDeltaStr = (new Date().getTime() - startTime).toString();
    const timeDeltaZeroStr = " "+"0".repeat(6 - timeDeltaStr.length);
    const memoryDelta = ((!isWeb ? process.memoryUsage().heapUsed / 1024 : 0) - startMemory).toFixed(0);
    const memoryDeltaZeroStr = " "+"0".repeat(8 - memoryDelta.length);
    if (
      typeof answer === "string" ?
        out === answer :
        answer.includes(out)
    ) console.log("\x1b[1m%s\x1b[42m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[0m", `${caseName}: `, ` AC `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB");
    else console.log("\x1b[1m%s\x1b[41m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[31m%s\x1b[0m", `${caseName}: `, ` WA `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB\n", out.slice(0, 10000));
  }

// cases
check(`5`,
`3`);
check(`17`,
`11`);
check(`9973`,
`6647`);
check(`49999`,
`33331`);
check(`199999`,
`133331`);
check(`2999999`,
`0`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[P]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
/**
 * @param {number} n 
*/
function genPrimes(n) {
  /** @type {(number | null)[]} */
  const net = Array.from({ length: n }, (_, i) => i);
  net[0] = null;
  net[1] = null;
  for (let i = 4; i < net.length; i += 2) {
    net[i] = null;
  }
  for (let i = 3; i < net.length; i++) {
    if (net[i] === null) continue;
    for (let j = i * 3; j < net.length; j += i * 2) {
      net[j] = null;
    }
  }
  return net.map(v => !!v);
}

const isPrime = genPrimes(P);
const primes = [];
for (let i = 0; i < isPrime.length; i++) {
  if (!isPrime[i]) continue;
  primes.push(i);
}

const dp = Array(P + 1).fill(null);
const dpp = Array(P + 1).fill(null);
function getCount(n) {
  if (dp[n]) return dp[n];
  const m = n - 1;
  const mh = Math.ceil(m / 2);
  let max = 0;
  for (const p of primes) {
    if (p > mh || p > 1000) break;
    if (!isPrime[m - p]) continue;
    const count = getCount(p) + getCount(m - p);
    if (max >= count) continue;
    max = count;
    dpp[n] = p;
  }
  dp[n] = max + 1;
  return dp[n];
}

const out = getCount(P);
// console.log(dp);

// output
return out;
}
