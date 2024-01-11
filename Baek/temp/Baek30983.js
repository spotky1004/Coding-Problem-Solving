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
// check(`5 3 5
// 1 1 2
// 1 4 3
// 2 1 4 5`,
// `0
// 3
// 3
// 0
// 0`);
check(`8 12 1000000
1 1 2
1 2 3
1 3 2
1 3 4
1 4 5
1 1 5
1 5 7
2 1 2 5
2 1 3 5
2 1 3 5
2 2 4 5
2 6 7 8`,
`636955754
558991041
389579690
164633774
972192816
731564500
191452920
731564500`);
// check(`3 1 3
// 2 1 2 3`,
// `0
// 0
// 0`);
// check(`3 2 4
// 1 1 2
// 1 1 3
// 2 1 2 3`,
// ``)
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, M, T], ...edges] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(BigInt));

// code
/**
 * @template {number | bigint} T 
 * @param {T[][]} a 
 * @param {T[][]} b 
 * @param {T} mod 
 * @returns {T[][]} 
 */
function matAdd(a, b, mod) {
  const zero = typeof a[0][0] === "bigint" ? 0n : 0;

  const rows = a.length;
  const cols = (a[0] ?? []).length;

  const out = Array.from({ length: rows }, () => Array(cols).fill(zero));
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      out[i][j] += (a[i][j] + b[i][j]) % mod;
    }
  }

  return out;
}

/**
 * @template {number | bigint} T 
 * @param {T[][]} a 
 * @param {T[][]} b 
 * @param {T[][]} mod 
 * @returns {T[][]} 
*/
function matMult(a, b, mod) {
  const zero = typeof a[0][0] === "bigint" ? 0n : 0;

  const rows = a.length;
  const cols = (b[0] ?? []).length;
  const addCount = (a[0] ?? []).length;

  const out = Array.from({ length: rows }, () => Array(cols).fill(zero));
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      for (let k = 0; k < addCount; k++) {
        out[i][j] += a[i][k] * b[k][j];
      }
    }
  }

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      out[i][j] %= mod;
    }
  }

  return out;
}

/**
 * @template {any} T 
 * @param {T[][]} a 
 * @param {T} n 
 * @returns {T[][]} 
 */
function matPow(a, n, mod) {
  const zero = typeof n === "bigint" ? 0n : 0;
  const one = typeof n === "bigint" ? 1n : 1;

  let out = Array.from({ length: a.length }, (_, i) => {
    const row = Array(a.length).fill(zero);
    row[i] = one;
    return row;
  });
  let bit = one;
  let base = one + one;
  let tmp = a;

  while (bit <= n) {
    if ((bit & n) !== zero) {
      out = matMult(out, tmp).map(row => row.map(v => v % mod));
    }
    tmp = matMult(tmp, tmp).map(row => row.map(v => v % mod));
    bit *= base;
  }

  return out;
}

/**
 * @template {number | bigint} T 
 * @param {T} n 
 * @returns {T[][]} 
 */
function zeroMat(n) {
  const zero = typeof n === "bigint" ? 0n : 0;

  n = Number(n);
  return Array.from({ length: n }, _ => Array(n).fill(zero));
}

/**
 * @template {number | bigint} T 
 * @param {T} n 
 * @returns {T[][]} 
 */
function identityMat(n) {
  const zero = typeof n === "bigint" ? 0n : 0;
  const one = typeof n === "bigint" ? 1n : 1;

  const out = zeroMat(n);
  for (let i = zero; i < n; i++) {
    out[i][i] = one;
  }

  return out;
}

function printMat(m) {
  console.log(m.map(v => v.join(" ")).join("\n") + "\n");
}



const mod = 1_000_000_007n;

const size = Number(N);
const A = Array.from({ length: size }, _ => Array(size).fill(0n));
const B = Array.from({ length: size }, _ => Array(size).fill(0n));

for (const [type, a, b, c] of edges) {
  const [u, v, w] = [a, b, c].map(v => Number(v) - 1);
  if (type === 1n) {
    A[u][v]++;
    A[v][u]++;
  } else if (type === 2n) {
    B[u][v]++;
    B[u][w]++;
    B[v][u]++;
    B[v][w]++;
    B[w][u]++;
    B[w][v]++;
  }
}

const N0 = zeroMat(N);
const N1 = identityMat(N);
let cur = null;
let bin = 1n;
let mul = [
  [A, N1],
  [B, N0]
];
while (bin <= (T + 1n)) {
  if ((bin & (T + 1n)) !== 0n) {
    if (cur === null) {
      cur = mul;
    } else {
      const next = [[], []];
      next[0][0] = matAdd(matMult(cur[0][0], mul[0][0], mod), matMult(cur[0][1], mul[1][0], mod), mod);
      next[0][1] = matAdd(matMult(cur[0][0], mul[0][1], mod), matMult(cur[0][1], mul[1][1], mod), mod);
      next[1][0] = matAdd(matMult(cur[1][0], mul[0][0], mod), matMult(cur[1][1], mul[1][0], mod), mod);
      next[1][1] = matAdd(matMult(cur[1][0], mul[0][1], mod), matMult(cur[1][1], mul[1][1], mod), mod);
      cur = next;
    }
  }

  const nextMul = [[], []];
  nextMul[0][0] = matAdd(matMult(mul[0][0], mul[0][0], mod), matMult(mul[0][1], mul[1][0], mod), mod);
  nextMul[0][1] = matAdd(matMult(mul[0][0], mul[0][1], mod), matMult(mul[0][1], mul[1][1], mod), mod);
  nextMul[1][0] = matAdd(matMult(mul[1][0], mul[0][0], mod), matMult(mul[1][1], mul[1][0], mod), mod);
  nextMul[1][1] = matAdd(matMult(mul[1][0], mul[0][1], mod), matMult(mul[1][1], mul[1][1], mod), mod);
  mul = nextMul;

  bin *= 2n;
}

// cur.forEach(row => row.forEach(m => printMat(m)));
const t0 = Array(size).fill(0n);
t0[0] = 1n;
const tm1 = Array(size).fill(0n);
[[t0, tm1]].forEach(row => row.forEach(m => printMat(m)));
const result = matMult([[t0, tm1]], cur, mod)[0];

// output
return result.join("\n");
}
