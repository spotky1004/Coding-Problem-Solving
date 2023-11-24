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
check(`1`, `1`);
check(`2`, `4`);
check(`3`, `10`);
check(`6`, `52`);
check(`48`, `586527012`);
check(`55820`, `779963626`);
check(`493744614`, `784740381`);
check(`999999937`, `236352430`);
check(`999999999`, `546275650`);
check(`1000000000`, `23412252`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[n]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(BigInt));

// code
/**
 * @template {BigInt} T 
 * @param {T[][]} a 
 * @param {T[][]} b 
 * @returns {T[][]} 
*/
function matrixMult(a, b) {
  return [
    [
      a[0][0] * b[0][0] + a[0][1] * b[1][0],
      a[0][0] * b[0][1] + a[0][1] * b[1][1]
    ],
    [
      a[1][0] * b[0][0] + a[1][1] * b[1][0],
      a[1][0] * b[0][1] + a[1][1] * b[1][1]
    ]
  ];
}

function genPhi(n) {
  const isPrime = Array(n + 1).fill(true);
  const primes = [];
  const phi = Array(n + 1).fill(0);
  phi[1] = 1;

  for (let i = 2; i <= n; i++) {
    if (isPrime[i]) {
      primes.push(i);
      phi[i] = i - 1;
    }
    for (const p of primes) {
      if (i * p > n) break;
      isPrime[i * p] = false;
      if (i % p === 0) {
        phi[i * p] = phi[i] * p;
      } else {
        phi[i * p] = phi[i] * phi[p];
      }
    }
  }

  return phi;
}

const phiSumCache = new Map();
function clacPhiSum(n) {
  if (n <= phiSumCount) return BigInt(phiSums[n]);
  if (phiSumCache.has(n)) return phiSumCache.get(n);

  let sum = (n * (n + 1n) / 2n) % p;
  let s = 1n, a = n / s, e = n / a;
  while (s <= n) {
    s = e + 1n;
    if (s > n) break;
    a = n / s;
    e = n / a;

    sum -= clacPhiSum(a) * (e - s + 1n);
  }

  sum = ((sum % p) + p) % p;
  phiSumCache.set(n, sum);

  return sum % p;
}



const p = 1_000_000_007n;
const phiSumCount = 5_000_000;

const phiSums = genPhi(phiSumCount);
const numP = Number(p);
for (let i = 1; i <= phiSumCount; i++) {
  phiSums[i] = (phiSums[i - 1] + phiSums[i]) % numP;
}

const fibMatrix = [[1n, 1n], [1n, 0n]];
const fibMatrixPows = [fibMatrix];
for (let i = 1; i <= 31; i++) {
  const nextPow = matrixMult(fibMatrixPows[i - 1], fibMatrixPows[i - 1]);
  fibMatrixPows.push(nextPow.map(row => row.map(v => v % p)));
}

function calcFibSum(n) {
  const t = n + 1n;
  let mat = fibMatrix;
  for (let i = 0n; i < 32n; i++) {
    const bit = 1n << i;

    if ((t & bit) === 0n) continue;
    mat = matrixMult(mat, fibMatrixPows[i])
      .map(row => row.map(v => v % p));
  }

  return (mat[0][1] - 1n + p) % p;
}

let sum = 0n;
let s = 1n, a = n / s, e = n / a;
while (s <= n) {
  sum += (calcFibSum(e) - calcFibSum(s - 1n)) * (2n * clacPhiSum(a) - 1n);

  s = e + 1n;
  if (s > n) break;
  a = n / s;
  e = n / a;
}

sum = ((sum % p) + p) % p;

// output
return sum.toString();
}
