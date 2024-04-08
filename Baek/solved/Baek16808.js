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
/**
 * @param {bigint} a 
 * @param {bigint} b 
 * @param {bigint} p
*/
function divAndPow(a, b, p) {
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

const ans = [null, null];
iLoop: for (let i = 2n; i <= 200n; i++) {
  let pow = 1n;
  jLoop: for (let j = 1n; j < i; j++) {
    pow *= i;
    for (let k = 0n; k < i; k++) {
      if (divAndPow(k, pow, i) !== k) continue jLoop;
    }
    ans.push(Number(j));
    continue iLoop;
  }
  ans.push(-1);
}

for (let N = 2; N < ans.length; N++) {
  check(N.toString(), ans[N].toString(), `N = ${N}, k = ${ans[N]}`);
}
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N]] = input
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
function divAndPow(a, b, p) {
  if (b === 0n) return 1n;
  let out = 1n;
  let curMul = a;
  while (b > 0n) {
    if (b & 1n) {
      out = out*curMul % p;
    }
    b /= 2n;
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

/**
 * @template {number | bigint} T 
 * @param {T} n 
 * @param {T[]} factors 
 * @returns {T} 
*/
function eularPhi(n, factors) {
  let out = n;
  for (const factor of [...new Set(factors)]) {
    out -= out / factor;
  }
  return out;
}

/**
 * @param {bigint} x 
 * @param {bigint} n 
 * @param {bigint[]} phiNFactorization 
 */
function calcOrder(x, n, phiNFactorization) {
  if (gcd(x, n) !== 1n) return -1n;

  let order = phiNFactorization.reduce((a, b) => a * b, 1n);

  for (const p of phiNFactorization) {
    if (divAndPow(x, order / p, n) !== 1n) continue;
    order /= p;
  }

  return order;
}



if (N === 2n) return 1n;
const phiN = eularPhi(N, primeFactorization(N));
if (gcd(N, phiN) !== 1n) return -1n;

let ans = calcOrder(N, phiN, primeFactorization(eularPhi(phiN, primeFactorization(phiN))));
const iterCount = 1000n < N ? 1000n : N - 1n;
loop: for (const p of primeFactorization(ans)) {
  let tmp = ans / p;
  const pow = divAndPow(N, tmp, phiN);
  for (let i = 1n; i < iterCount; i++) {
    if (i !== divAndPow(i, pow, N)) continue loop;
  }
  ans = tmp;
}

// output
return ans + "";
}
