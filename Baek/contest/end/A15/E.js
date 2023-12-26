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
const primes = genPrimes(Math.ceil(Math.sqrt(1e9)) + 1);

check(`5
7 3 4 2 6`,
`3 4 2 6 7`);
check(`10\n` + primes.slice(0, 10).reverse().join(" "),
`2 3 5 7 11 13 17 19 23 29`);
check(`3000\n` + primes.slice(0, 3000).reverse().join(" "),
primes.slice(0, 3000).join(" "));
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], A] = input
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



const primes = genPrimes(Math.ceil(Math.sqrt(1e9)) + 1);
/** @type {number[]} */
const bigFactors = [];
for (let i = 0; i < N; i++) {
  let a = A[i];
  for (const p of primes) {
    while (a % p === 0) {
      a /= p;
    }
    if (a === 1) break;
  }
  if (a !== 1) bigFactors.push(a);
  else bigFactors.push(null);
}

const intChecks = Array.from({ length: N }, _ => Array(N).fill(false));
for (const p of primes) {
  const avaiables = [];
  for (let i = 0; i < N; i++) {
    if (A[i] % p === 0) avaiables.push(i);
  }
  if (avaiables.length <= 1) continue;

  for (let i = 0; i < avaiables.length; i++) {
    for (let j = i + 1; j < avaiables.length; j++) {
      intChecks[avaiables[i]][avaiables[j]] = true;
      intChecks[avaiables[j]][avaiables[i]] = true;
    }
  }
}
for (let i = 0; i < N; i++) {
  const a = bigFactors[i];
  if (a === null) continue;

  for (let j = i + 1; j < N; j++) {
    const b = bigFactors[j];
    if (b === null || a !== b) continue;
    intChecks[i][j] = true;
    intChecks[j][i] = true;
  }
}


const seq = A.map((v, i) => [v, i]);
for (let i = 0; i < N; i++) {
  const [a, aIdx] = seq[i];
  let moveCount = 0;
  for (let j = i + 1; j < N; j++) {
    const [b, bIdx] = seq[j];
    if (
      a < b ||
      intChecks[aIdx][bIdx]
    ) break;
    moveCount++;
  }
  if (moveCount >= 1) {
    seq.splice(i + moveCount, 0, seq.splice(i, 1)[0]);
    i--;
  }
}


// output
return seq.map(v => v[0]).join(" ");
}
