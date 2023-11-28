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
check(`3
2 1 2
2 2 3
3 1 2 3`,
`7
5
1`);
check(`1
1 1`,
`1`);
// check(`10000
// ` + (`100 ` + Array.from({ length: 100 }, (_, i) => i + 1).join(" ") + "\n").repeat(10000),
// `?`);
// check(`1000
// ` + (`1000 ` + Array.from({ length: 1000 }, (_, i) => i + 1).join(" ") + "\n").repeat(1000),
// `?`);
// check(`100
// ` + (`10000 ` + Array.from({ length: 10000 }, (_, i) => i + 1).join(" ") + "\n").repeat(100),
// `?`);
// check(`10
// ` + (`100000 ` + Array.from({ length: 100000 }, (_, i) => i + 1).join(" ") + "\n").repeat(10),
// `?`);
// check(`1
// ` + (`1000000 ` + Array.from({ length: 1000000 }, (_, i) => i + 1).join(" ") + "\n").repeat(1),
// `?`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], ...sets] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
/**
 * @param {number} to
 * @param {number} mod
*/
function genFactroialMod(to) {
  const arr = [1n];
  let cur = 1n;
  for (let i = 1n; i <= to; i++) {
    cur = (cur * i) % p;
    arr.push(cur);
  }

  return arr;
}

const combCache = new Map();
/**
 * @param {number} n 
 * @param {number} r 
 * @param {number} p
 * @param {number[]} factroials
*/
function combination(n, r) {
  const key = n * 100000000n + r;
  if (combCache.has(key)) return combCache.get(key);
  const result = factroials[n] * factorialModInv[n - r] * factorialModInv[r] % p;
  // combCache.set(key, result);
  return result;
}



const p = 998_244_353n;
const factroials = genFactroialMod(1_000_000n);

const modInv = Array(1_000_001);
modInv[0] = Infinity;
modInv[1] = 1n;
for (let i = 2n; i < modInv.length; i += 1n) {
  modInv[i] = modInv[p % i] * (p - p / i) % p;
}
const factorialModInv = Array(1_000_001);
factorialModInv[0] = 1n;
factorialModInv[1] = 1n;
for (let i = 2n; i < factorialModInv.length; i += 1n) {
  factorialModInv[i] = factorialModInv[i - 1n] * modInv[i] % p;
}

/** @type {Map<number, number>} */
const numCountsMap = new Map();
for (const [, ...S] of sets) {
  for (const Si of S) {
    if (!numCountsMap.has(Si)) {
      numCountsMap.set(Si, 1);
    } else {
      numCountsMap.set(Si, numCountsMap.get(Si) + 1);
    }
  }
}

let numCounts = Array.from(numCountsMap.values());
numCounts.sort((a, b) => b - a);
numCounts = numCounts.map(BigInt);

const out = [];
const bigN = BigInt(N);
for (let r = 1n; r <= bigN; r += 1n) {
  let sum = 0n;
  for (let j = 0; j < numCounts.length; j++) {
    const n = numCounts[j];
    if (n < r) break;
    sum += combination(n, r);
  }
  out.push(sum % p);
}

// output
return out.join("\n");
}
