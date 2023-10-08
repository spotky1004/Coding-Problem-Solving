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
 * @param {bigint} a 
 * @param {bigint} b 
 * @returns {bigint} 
*/
function gcd(a, b) {
  if (b > a) [a, b] = [a, b];
  if (b === 0n) return a;
  return gcd(b, a % b);
}
/**
 * @param {bigint} a 
 * @param {bigint} b 
 * @param {bigint} p
*/
function divAndPow(a, b, p) {
  let out = 1n;
  let curMul = a;
  const loopCount = BigInt(Math.ceil(Math.log2(Number(b))) + 1);
  for (let i = 0n; i < loopCount; i++) {
    if (b & 1n << i) {
      out = out*curMul % p;
    }
    curMul = curMul**2n % p;
  }
  return out;
}

/**
 * @param {bigint} n 
 * @param {bigint} c 
 * @returns {bigint[]} 
 */
function pollardRho(n, c = 1n) {
  n = BigInt(n);
  if (n === 1n || isPrime(n)) return n;
  if (n % 2n === 0n) return 2n;

  function g(x) {
    return (x * x + c) % n;
  }
  
  let a = 2n;
  let b = a;
  while (true) {
    a = g(a);
    b = g(g(b));
    if (a === b) return pollardRho(n, c + 1n);
    const dif = a - b;
    const d = gcd(n, dif > 0 ? dif : -dif);
    if (d === 1n) continue;
    return d;
  }
}

const millerRabinPrimes = [
  2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n,
  31n, 37n, 41n, 43n, 47n, 53n, 59n, 61n, 67n, 71n
];
/**
 * @param {bigint} n 
 * @returns {boolean} 
*/
function isPrime(n) {
  if (n === 2n) return true;
  if (n < 2n) return false;

  n = BigInt(n);
  d = n - 1n;

  let r = 0n;
  while ((d & 1n) === 0n) {
    r++;
    d /= 2n;
  }

  l: for (const p of millerRabinPrimes) {
    if (n === p) return true;
    if (divAndPow(p, d, n) === 1n) continue;
    for (let i = 0n; i < r; i++) {
      if (divAndPow(p, 2n**i * d, n) === n - 1n) continue l;
    }
    return false;
  }
  return true;
}

/**
 * @param {bigint} x 
 */
function primeFactorization(x) {
  if (x <= 3n) return [x];
  const toFactorization = [x];
  const factors = [];
  for (const n of toFactorization) {
    if (isPrime(n)) {
      factors.push(n);
      continue;
    }
    const p = pollardRho(n);
    const q = n / p;
    if (isPrime(p)) factors.push(p);
    else if (p !== 1n) toFactorization.push(p);
    if (isPrime(q)) factors.push(q);
    else if (q !== 1n) toFactorization.push(q);
  }
  return factors.sort((a, b) => Number(a - b));
}




const kFactors = primeFactorization(BigInt(K)).map(v => Number(v));
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
