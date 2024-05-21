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
check(`32 20`,
`16`);
check(`2016 100`,
`42`);
check(`1000 10`,
`1000`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[y, lower]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(BigInt));

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
function powMod(a, b, p) {
  if (b === 0n) return 1n;
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
    if (powMod(p, d, n) === 1n) continue;
    for (let i = 0n; i < r; i++) {
      if (powMod(p, 2n**i * d, n) === n - 1n) continue l;
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

/**
 * @param {[value: bigint, count: number][]} factorsCounts 
 * @returns {bigint[]]} 
*/
function calcDivisors(factors) {
  const divisors = new Set([1n]);
  for (const [value, count] of factors) {
    const newDivisors = new Set();
    let pow = value;
    for (let i = 0; i < count; i++) {
      for (const d of divisors) newDivisors.add(d * pow);
      pow *= value;
    }
    for (const d of newDivisors) divisors.add(d);
  }
  return [...divisors].sort((a, b) => Number(a - b));
}

/**
 * @param {bigint[]} arr 
 * @returns {[value: bigint, count: number][]} 
 */
function counter(arr) {
  const counts = [];
  arr = [...arr].sort((a, b) => Number(a - b));
  for (const v of arr) {
    if (counts.length === 0) counts.push([v, 1]);
    else if (counts[counts.length - 1][0] === v) counts[counts.length - 1][1]++;
    else counts.push([v, 1]);
  }
  return counts;
}



/**
 * @param {bigint} base 
 */
function convert(base) {
  let digits = [""];
  let n = y;
  while (n > 0n) {
    const digit = n % base;
    if (digit >= 10n) digits.push("a");
    else digits.push(digit.toString());
    n /= base;
  }
  return digits.reverse().join("");
}

/**
 * @param {bigint} base 
 */
function isConvertable(base) {
  let n = y;
  while (n > 0n) {
    if (n % base >= 10n) return false;
    n /= base;
  }
  return true;
}

/**
 * @param {string} a 
 * @param {string} b 
 */
function compare(a, b) {
  if (a.length > b.length) return 1;
  if (a.length < b.length) return -1;
  if (a === b) return 0;
  return 2 * (a > b) - 1;
}

let l = 10n, r = y + 1n;
const lowerStr = lower.toString();
while (l + 1n < r) {
  const m = (l + r) / 2n;
  if (compare(lowerStr, convert(m)) !== 1) l = m;
  else r = m;
}
while (compare(lowerStr, convert(l + 1n)) !== 1) l++;

// y mod b <= 9
// y ≡ k (mod b) (0 <= k <= 9)
// (y - k) = bx
// (y - k) / x = b (x is factor of (y - k))

let ans = 10n;
for (let i = 0n; i <= 9n; i++) {
  // console.log(y - i, primeFactorization(y - i), calcDivisors(counter(primeFactorization(y - i))));
  const sols = calcDivisors(counter(primeFactorization(y - i))).map(v => (y - i) / v);
  for (const sol of sols) {
    if (sol > l || ans > sol || !isConvertable(sol)) continue;
    ans = sol;
  }
}

// output
return ans.toString();
}
