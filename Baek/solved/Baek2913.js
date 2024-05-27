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
    else {
      console.log("\x1b[1m%s\x1b[41m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[31m%s\x1b[0m", `${caseName}: `, ` WA `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB\n", out.slice(0, 10000));
      // throw "!";
    }
  }

// cases
// check(`1 1
// 26 02 03 03 1`,
// `5`);
// check(`1 1
// 26 02 03 03 2`,
// `185`);
// check(`3 3
// 22 03 01 10 9 10 10
// 05 05 16 12 1 7 10
// 20 06 15 01 4 9 10`,
// `102
// 204
// 125`);
// check(`2 6
// 01 01 02 01 2 3 4 5 6 7
// 01 01 02 01 3 4 5 6 7 8`,
// ``);
// check(`2 6
// 01 01 02 01 5 1 1 1 1 1
// 01 01 02 01 0 0 0 5 1 1`,
// `365
// 365
// 365
// 365
// 1
// 365`);
// check(`1 5
// 01 01 02 01 5 5 5 5 5`,
// `-1`);
// check(`2 5
// 01 01 02 01 1 0 2 0 0
// 01 01 02 01 1 0 1 0 0`,
// `-1`);
// check(`1 5
// 01 01 02 01 73 73 5 73 5`,
// `-1`);
// check(`1 1
// 01 01 01 01 1`,
// `365`);
// check(`8 3
// 13 06 17 04 54 79 13
// 14 05 05 05 15 28 195
// 19 04 15 10 109 147 108
// 17 08 16 02 26 1 58
// 22 12 29 10 36 186 46
// 16 12 10 10 164 39 143
// 26 05 04 01 188 165 119
// 04 02 16 11 93 79 13`,
// `93
// 142
// 66`);
// check(`9 3
// 11 08 14 01 59 169 121
// 04 01 17 06 44 59 197
// 27 12 08 03 172 54 122
// 14 09 07 02 108 51 157
// 21 01 25 11 13 9 153
// 20 08 26 08 106 10 134
// 06 07 17 02 103 89 24
// 26 08 19 10 184 46 15
// 14 08 30 09 36 131 175`,
// `4
// 73
// 193`);
// check(`3 3
// 10 04 10 05 35 83 109
// 07 04 22 08 151 34 157
// 05 02 10 01 51 152 25`,
// `77
// 51
// 218`);

const randInt = (l, r) => Math.floor(Math.random() * (r - l + 1)) + l;
const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
function numToDay(x) {
  let m = 0;
  while (x >= days[m]) {
    x -= days[m];
    m++;
  }
  return `${(x + 1).toString().padStart(2, "0")} ${(m + 1).toString().padStart(2, "0")}`;
}

function genCase() {
  const N = randInt(1, 10);
  const M = randInt(1, 3);

  const sol = Array.from({ length: M }, () => randInt(1, 365));
  const lines = [`${N} ${M}`];
  for (let i = 0; i < N; i++) {
    const F = Array.from({ length: M }, () => randInt(0, 200));
    const s = randInt(0, 364);
    const e = (s + F.reduce((a, b, i) => a + sol[i] * b, 0)) % 365;
    lines.push(`${numToDay(s)} ${numToDay(e)} ${F.join(" ")}`);
  }
  const tc = lines.join("\n");
  const ans = sol.join("\n");
  console.log(tc);
  console.log(ans);
  check(tc, ans);
}

// for (let i = 0; i < 1000; i++) genCase();
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, M], ...records] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
/**
 * @param {number} a 
 * @param {number} b 
*/
function gcd(a, b) {
  return b ? gcd(b, a%b) : a;
}

/**
 * Solves "ax + by = n"
 * @param {bigint} a 
 * @param {bigint} b 
 * @param {bigint} n 
 * @returns {[x: bigint, y: bigint]?} 
*/
function exGcd(a, b, n) {
  if (a > b) {
    const value = exGcd(b, a, n);
    if (!value) return null;
    let [y, x] = value;
    if (b !== 0n) {
      let t = -x / b;
      if (t > 0n) t++;
      x += b * t;
      y -= a * t;
    }
    return [x, y];
  }

  if (a === 0n && b === 0n) {
    if (n === 0n) return [0n, 0n];
    return null;
  }
  if (a === 0n) {
    if (gcd(b, n) !== b) return null;
    return [0n, n / b];
  }
  if (b === 0n) {
    if (gcd(a, n) !== a) return null;
    return [n / a, 0n];
  }
  if (n === 0n) return [0n, 0n];

  const aModGcd = gcd(a, b);
  if (n % aModGcd !== 0n) return null;
  
  a /= aModGcd;
  b /= aModGcd;
  n /= aModGcd;
  let [xp, yp] = exGcdImpl(a, b);
  let x = xp * n;
  let y = yp * n;
  let t = -x / b;
  if (t > 0n) t++;
  x += b * t;
  y -= a * t;
  return [x, y];
}

/**
 * @param {bigint} a 
 * @param {bigint} b 
 * @returns {[x: bigint, y: bigint]} 
 */
function exGcdImpl(a, b) {
  if (a < b) return exGcdImpl(b, a);
  const r = a % b;
  const q = (a - r) / b;
  if (r === 0n) return [1n, 0n];
  const [yp, xp] = exGcdImpl(b, r);
  return [xp - q * yp, yp];
}

/**
 * @param {[x: bigint, m: bigint][]} exprs 
*/
function crt(exprs) {
  let [a1, m1] = exprs[0];
  for (let i = 1; i < exprs.length; i++) {
    let [a2, m2] = exprs[i];
    const g = gcd(m1, m2);
    if ((a2 - a1) % g !== 0n) return null;
    const newM = m1 * m2 / g;
    a1 = (((a1 + m1 * (((a2 - a1) / g) * exGcd(m1 / g, m2 / g, 1n)[0] % (m2 / g))) % newM) + newM) % newM;
    m1 = newM;
  }
  return [a1, m1];
}

/**
 * @param {number} a 
 * @param {number} b 
 * @param {number} m 
 */
function div(a, b, m) {
  return ((Number(exGcd(BigInt(b), BigInt(m), BigInt(a))[0]) % m) + m) % m;
}



const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
function convertToDays(m, d) {
  let day = d - 1;
  for (let i = 0; i < m - 1; i++) day += days[i];
  return day
}

const ogMat = [];
for (const [d1, m1, d2, m2, ...f] of records) {
  const diff = ((convertToDays(m2, d2) + 365) - convertToDays(m1, d1)) % 365;
  ogMat.push([...f, diff]);
}

/**
 * @param {number} mod 
 */
function solveFor(mod) {
  const mat = ogMat.map(row => row.map(v => v % mod));

  function makeZero(sourceRow, targetRow, pos) {
    const source = mat[sourceRow];
    const target = mat[targetRow];
  
    if (target[pos] === 0) return;
    if (source[pos] === 0) throw "!";
    const mul = target[pos];
    for (let i = 0; i < target.length; i++) target[i] *= source[pos];
    for (let i = 0; i < target.length; i++) {
      target[i] = (((target[i] - mul * source[i]) % mod) + mod) % mod;
    }
  }

  for (let i = 0; i < N; i++) {
    let minCol = M;
    for (let j = i; j < N; j++) {
      const colTestTo = Math.min(minCol - 1, M - 1);
      for (let k = 0; k <= colTestTo; k++) {
        if (mat[j][k] === 0) continue;
        [mat[i], mat[j]] = [mat[j], mat[i]];
        minCol = k;
        break;
      }
    }
    if (minCol === M) break;
  
    for (let j = 0; j < N; j++) {
      if (i === j) continue;
      makeZero(i, j, minCol);
    }
  
    let minRow = i;
    minCol = Infinity;
    for (let j = i; j < N; j++) {
      const colTestTo = Math.min(minCol - 1, M - 1);
      for (let k = 0; k <= colTestTo; k++) {
        if (mat[j][k] === 0) continue;
        minRow = j;
        minCol = k;
        break;
      }
    }
    [mat[i], mat[minRow]] = [mat[minRow], mat[i]];
  }

  const sol = Array(M).fill(0);
  let minCol = M;
  for (let i = N - 1; i >= 0; i--) {
    for (let j = 0; j < minCol; j++) {
      if (mat[i][j] === 0) continue;
      minCol = j;
      const divVal = mat[i][j];
      let curSol = div(mat[i][M], divVal, mod);
      for (let k = j + 1; k < M; k++) curSol += div(-mat[i][k] * sol[k], divVal, mod);
      sol[j] = curSol % mod;
      break;
    }
  }

  return sol.map(v => ((v % mod) + mod) % mod);
}



const sol1 = solveFor(5);
const sol2 = solveFor(73);
if (sol1 === -1 || sol2 === -1) return -1;
const sol = [];
for (let i = 0; i < M; i++) {
  sol.push(Number(crt([
    [BigInt(sol1[i]), 5n],
    [BigInt(sol2[i]), 73n],
  ])[0]) || 365);
}

// console.log(sol1, sol2, sol);
for (let i = 0; i < N; i++) {
  let sum = 0;
  for (let j = 0; j < M; j++) sum += sol[j] * ogMat[i][j];
  // console.log(i, ogMat[i][M], sum % 365);
  if (ogMat[i][M] !== sum % 365) return -1;
}

// output
return sol.join("\n");
}
