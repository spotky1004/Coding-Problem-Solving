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
check(`1 2`, `2`);
check(`3 4`, `12`);
check(`10 15`, `150`);
check(`893724358493284 238947328947329`, `213553048277135320552236238436`);
check(`0 0`, `0`);
check(`1 0`, `0`);
check(`1 1`, `1`);
check(`${Array.from({ length: 1000000 }, () => Math.floor(Math.random() * 10)).join("")} ${Array.from({ length: 1000000 }, () => Math.floor(Math.random() * 10)).join("")}`, "")
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[A, B]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" "));

// code
const p = 81788929;
const r = 7;

/**
 * @param {number} a 
 * @param {number} b 
 * @param {number} p
*/
function divAndPow(a, b, p) {
  let out = 1;
  let curMul = a;
  while (b > 0) {
    if (b & 1) out = out*curMul % p;
    b >>= 1;
    curMul = curMul * curMul % p;
  }
  return out;
}

/**
 * @param {number[]} a 
 * @param {number[]} b 
 * @param {number} p 
 * @param {number} r 
*/
function convolution(a, b, p, r) {
  const N = 2 ** Math.ceil(Math.log2(Math.max(a.length, b.length)) + 1);
  const aPadLen = N - a.length;
  const bPadLen = N - b.length;
  const outLen = a.length + b.length - 1;
  a = [...a];
  b = [...b];
  for (let i = 0; i < aPadLen; i++) a.push(0);
  for (let i = 0; i < bPadLen; i++) b.push(0);

  const order = Array(N).fill(0);
  for (let i = 1; i < N; i <<= 1) {
    const add = N / i / 2;
    for (let j = i; j < N; j++) {
      if (i & j) order[j] += add;
    }
  }

  const w = divAndPow(r, (p - 1) / N, p);
  let wTmp = 1;
  const wPows = Array(N);
  for (let i = 0; i < N; i++) {
    wPows[i] = wTmp;
    wTmp = wTmp * w % p;
  }
  const wInv = divAndPow(w, p - 2, p);
  wTmp = 1;
  const wInvPows = Array(N);
  for (let i = 0; i < N; i++) {
    wInvPows[i] = wTmp;
    wTmp = wTmp * wInv % p;
  }

  dft(a, wPows, order, p);
  dft(b, wPows, order, p);
  for (let i = 0; i < N; i++) a[i] = a[i] * b[i] % p;

  dft(a, wInvPows, order, p);
  const Ninv = divAndPow(N, p - 2, p);
  for (let i = 0; i < a.length; i++) a[i] = a[i] * Ninv % p;
  while (a.length > outLen) a.pop();
  
  return a;
}

/**
 * @param {number[]} f 
 * @param {number[]} w 
 * @param {number[]} order 
 * @param {number} order 
*/
function dft(f, wPows, order, p) {
  const N = f.length;

  for (let i = 0; i < N; i++) {
    const x = order[i];
    const y = order[x];
    if (x >= y) continue;
    [f[x], f[y]] = [f[y], f[x]];
  }

  for (let i = 2; i <= N; i <<= 1) {
    const wPowAcc = N / i;
    const half = i / 2;
    for (let j = 0; j < N; j += i) {
      let wPow = 0;
      for (let k = 0; k < half; k++) {
        const oMul = wPows[wPow] * f[j + half + k] % p;
        [f[j + k], f[j + half + k]] = [(f[j + k] + oMul) % p, (f[j + k] - oMul + p) % p];
        wPow += wPowAcc;
      }
    }
  }
}



const mul = convolution(Array.from(A).reverse().map(Number), Array.from(B).reverse().map(Number), p, r);
const out = Array(2000020).fill(0);
for (let i = 0; i < mul.length; i++) {
  const value = out[i] + mul[i];
  out[i] = value % 10;
  let rem = (value - value % 10) / 10;
  let d = 1;
  while (0 < rem) {
    out[i + d] += rem % 10;
    rem = (rem - rem % 10) / 10;
    d++;
  }
}
while (out[out.length - 1] === 0) out.pop();
if (out.length === 0) out.push(0);

// output
return out.reverse().join("");
}
