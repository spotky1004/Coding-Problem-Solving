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
check(`22 1`, `25`);
check(`22 1`, `25`);
check(`1 1`, `4`);
check(`4 1`, `8`);
check(`1000000000000000000 100000`, `1004150359457526961`);

// /**
//  * @param {number} n 
// */
// function genPrimes(n) {
//   /** @type {number[]} */
//   const primes = [];
//   const net = Array(n).fill(true);
//   for (let i = 2; i <= n; i++) {
//     if (net[i]) primes.push(i);
//     for (const p of primes) {
//       const a = i * p;
//       if (a > n) break;
//       net[a] = false;
//       if (i % p === 0) break;
//     }
//   }
//   return primes;
// }

// const primes = genPrimes(1e4);
// let powers = [];
// const cap = primes[primes.length - 1] ** 2;
// for (const p of primes) {
//   for (const q of primes) {
//     const pow = p ** q;
//     if (pow <= cap) powers.push(pow);
//   }
// }
// powers = [...new Set(powers)].sort((a, b) => a - b);

// for (let i = 0; i < powers.length; i++) {
//   check(`1 ${i + 1}`, powers[i].toString());
// }
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[n, k]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(BigInt));

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

const primes = genPrimes(2e6);
const primesSet = new Set(primes);
const bigPrimes = primes.map(BigInt);
/**
 * @param {number} n 
 */
function isPrime(n) {
  n = Number(n);
  if (primesSet.has(n)) return true;
  for (const p of primes) {
    if (n % p === 0) return false;
    if (p * p > n) return true;
  }
  return true;
}



let powers = [];
for (const p of bigPrimes) {
  for (const q of bigPrimes) {
    if (Number(p)**Number(q) > 1e25) break;
    const value = p ** q;
    if (n < value) powers.push(value);
  }
}
const numN = Number(n);

let count = 0n;
for (let i = BigInt(Math.ceil(Math.sqrt(numN + 1))); ; i++) {
  const value = i * i;
  if (!isPrime(i) || value <= n) continue;
  count++;
  powers.push(value);
  if (count === k) break;
}

count = 0n;
for (let i = BigInt(Math.ceil(Math.cbrt(numN + 1))); ; i++) {
  const value = i * i * i;
  if (!isPrime(i) || value <= n) continue;
  count++;
  powers.push(value);
  if (count === k) break;
}

powers = [...new Set(powers)].sort((a, b) => Number(a - b));

// output
return powers[Number(k) - 1];
}
