const isWeb = typeof window === "object";
const isDev = isWeb || require("fs").existsSync("C:/users/spotky");

if (!isDev) {
  const input = require("fs").readFileSync("/dev/stdin").toString();
  const out = solve(input);
  console.log(out);
} else {
  if (!isWeb) require('node:v8').setFlagsFromString('--stack-size=65536');

  let CASE_NR = 1;
  function check(input, answer, caseName=`Case ${CASE_NR}`) {
    CASE_NR++;
    const startTime = new Date().getTime();
    const startMemory = !isWeb ? process.memoryUsage().heapUsed / 1024 : 0;
    const out = solve(input).toString().trim();
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
check(`6 3
1 3 2`,
`3 2 3`);
check(`504 1
1`,
`7`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[K, Q], A] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
/**
 * @param {number} n 
*/
function genPrimes(n) {
  /** @type {number[]} */
  const primes = [];
  const net = Array(n).fill(true);
  for (let i = 2; i <= n; i++) {
    if (net[i]) primes.push(i);
    for (const p of primes) {
      const a = i * p;
      if (a > n) break;
      net[a] = false;
      if (i % p === 0) break;
    }
  }
  return primes;
}

/**
 * @param {number} n 
 * @param {number[]} primes 
*/
function primeFactorization(n, primes) {
  const factrors = [];

  const tryFor = Math.ceil(Math.sqrt(n));
  for (const p of primes) {
    if (p > tryFor || p > n) break;
    if (n % p !== 0) continue;
    while (n % p === 0) {
      n /= p;
      factrors.push(p);
    }
  }
  if (n !== 1) factrors.push(n);
  
  return factrors;
}




const primes = genPrimes(Math.ceil(Math.sqrt(1e15)));
const kFactors = primeFactorization(K, primes);
const kFactorCounter = [];
let prevFactor = -1;
for (const kFactor of kFactors) {
  if (prevFactor !== kFactor) {
    prevFactor = kFactor;
    kFactorCounter.push([kFactor, 0]);
  }
  kFactorCounter[kFactorCounter.length - 1][1]++;
}

const out = [];
for (const a of A) {
  const factorNeeds = [];
  let t = a;
  for (let i = 0; i < kFactorCounter.length; i++) {
    const [kFactor, factorNeed] = kFactorCounter[i];
    let alreadyCounter = 0;
    while (t % kFactor === 0) {
      t /= kFactor;
      alreadyCounter++;
    }
    factorNeeds.push(factorNeed - alreadyCounter);
  }

  let maxDay = 1;
  for (let i = 0; i < factorNeeds.length; i++) {
    const kFactor = kFactorCounter[i][0];
    const factorNeed = factorNeeds[i];
    let day = 0;
    let factorGot = 0;
    while (factorGot < factorNeed) {
      day += kFactor;
      let t = day;
      while (t % kFactor === 0) {
        t /= kFactor;
        factorGot++;
      }
    }
    maxDay = Math.max(maxDay, day);
  }

  out.push(maxDay);
}

// output
return out.join(" ");
}
