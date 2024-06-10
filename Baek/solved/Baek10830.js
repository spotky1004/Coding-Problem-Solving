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
check(`2 5
1 2
3 4`,
`69 558
337 406`);
check(`3 3
1 2 3
4 5 6
7 8 9`,
`468 576 684
62 305 548
656 34 412`);
check(`5 10
1 0 0 0 1
1 0 0 0 1
1 0 0 0 1
1 0 0 0 1
1 0 0 0 1`,
`512 0 0 0 512
512 0 0 0 512
512 0 0 0 512
512 0 0 0 512
512 0 0 0 512`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, B], ...A] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(BigInt));

// code
/**
 * @template {any} T 
 * @param {T[][]} a 
 * @param {T[][]} b 
 * @param {T[][] | undefined} mod 
 * @returns {T[][]} 
*/
function matrixMult(a, b, mod) {
  const rows = a.length;
  const cols = (b[0] ?? []).length;
  const t = (a[0] ?? []).length;

  const ZERO = typeof a[0][0] === "number" ? 0 : 0n;

  const out = Array.from({ length: rows }, () => Array(cols).fill(ZERO));
  if (typeof mod !== "undefined") {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        for (let k = 0; k < t; k++) {
          out[i][j] = (out[i][j] + a[i][k] * b[k][j]) % mod;
        }
      }
    }
  } else {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        for (let k = 0; k < t; k++) {
          out[i][j] += a[i][k] * b[k][j];
        }
      }
    }
  }

  return out;
}

/**
 * @template {any} T 
 * @param {T[][]} a 
 * @param {T} n 
 * @param {T | undefined} mod 
 * @returns {T[][]} 
*/
function matrixPow(a, n, mod) {
  const size = a.length;

  const ZERO = typeof a[0][0] === "number" ? 0 : 0n;
  const ONE = typeof a[0][0] === "number" ? 1 : 1n;
  const TWO = typeof a[0][0] === "number" ? 2 : 2n;

  let out = Array.from({ length: size }, () => Array(size).fill(ZERO));
  for (let i = 0; i < size; i++) {
    out[i][i] = ONE;
  }

  let bit = ONE;
  let pow = a;
  while (bit <= n) {
    if ((bit & n) === bit) {
      out = matrixMult(out, pow, mod);
    }
    pow = matrixMult(pow, pow, mod);
    bit *= TWO;
  }

  return out;
}


// output
return matrixPow(A, B, 1000n).map(row => row.join(" ")).join("\n");
}
