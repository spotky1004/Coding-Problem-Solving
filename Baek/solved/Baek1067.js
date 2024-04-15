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
check(`4
1 2 3 4
6 7 8 5`,
`70`);
check(`5
1 1 1 1 1
1 1 1 1 1`,
`5`);
check(`10
23 4 95 20 17 94 63 44 13 96
87 54 13 18 61 24 17 94 53 2`,
`28886`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], X, Y] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
/**
 * @typedef {[r: number, e: number]} Complex 
 * @typedef {(x: Complex, y: Complex) => Complex} ComplexBinOperation 
*/

/** @type {(n: number) => Complex} */
const calcNthRootOfUnity = (n) => [Math.cos(2 * Math.PI / n), Math.sin(2 * Math.PI / n)];
/** @type {(x: Complex) => Complex} */
const Complex = (x) => [x, 0];
/** @type {ComplexBinOperation} */
const cAdd = (x, y) => [x[0] + y[0], x[1] + y[1]];
/** @type {ComplexBinOperation} */
const cSub = (x, y) => [x[0] - y[0], x[1] - y[1]];
/** @type {ComplexBinOperation} */
const cMul = (x, y) => [x[0] * y[0] - x[1] * y[1], x[0] * y[1] + x[1] * y[0]];
/** @type {(x: Complex) => Complex} */
const cInv = (x) => {
  const den = x[0]**2 + x[1]**2;
  return [x[0] / den, -x[1] / den];
}

/**
 * @param {number[]} a 
 * @param {number[]} b 
*/
function convolution(a, b) {
  const N = 2 ** Math.ceil(Math.log2(Math.max(a.length, b.length)) + 1);
  const aPadLen = N - a.length;
  const bPadLen = N - b.length;
  const outLen = a.length + b.length - 1;
  a = a.map(Complex);
  b = b.map(Complex);
  for (let i = 0; i < aPadLen; i++) a.push([0, 0]);
  for (let i = 0; i < bPadLen; i++) b.push([0, 0]);

  const order = Array(N).fill(0);
  for (let i = 1; i < N; i <<= 1) {
    const add = N / i / 2;
    for (let j = i; j < N; j++) {
      if (i & j) order[j] += add;
    }
  }

  const w = calcNthRootOfUnity(N);
  let wTmp = [1, 0];
  const wPows = Array(N);
  for (let i = 0; i < N; i++) {
    wPows[i] = wTmp;
    wTmp = cMul(wTmp, w);
  }
  const wInv = cInv(calcNthRootOfUnity(N));
  wTmp = [1, 0];
  const wInvPows = Array(N);
  for (let i = 0; i < N; i++) {
    wInvPows[i] = wTmp;
    wTmp = cMul(wTmp, wInv);
  }

  dft(a, wPows, order);
  dft(b, wPows, order);
  for (let i = 0; i < N; i++) {
    a[i] = cMul(a[i], b[i]);
  }

  dft(a, wInvPows, order);
  for (let i = 0; i < a.length; i++) {
    a[i] = Math.round(a[i][0] / N);
  }
  while (a.length > outLen) a.pop();
  
  return a;
}

/**
 * @param {number[]} f 
 * @param {Complex[]} w 
 * @param {number[]} order 
*/
function dft(f, wPows, order) {
  const N = f.length;

  let tmp;
  for (let i = 0; i < N; i++) {
    const x = order[i];
    const y = order[x];
    if (x >= y) continue;
    tmp = f[x];
    f[x] = f[y];
    f[y] = tmp;
  }

  for (let i = 2; i <= N; i <<= 1) {
    const wPowAcc = N / i;
    const half = i / 2;
    for (let j = 0; j < N; j += i) {
      let wPow = 0;
      for (let k = 0; k < half; k++) {
        const oMul = cMul(wPows[wPow], f[j + half + k]);
        tmp = cSub(f[j + k], oMul);
        f[j + k] = cAdd(f[j + k], oMul);
        f[j + half + k] = tmp;
        wPow += wPowAcc;
      }
    }
  }
}

const mul = convolution(X.concat(X), Y.reverse());

// output
return Math.max(...mul);
}
