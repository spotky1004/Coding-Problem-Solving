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
check(`5
6
8
10
12
100`,
`1
1
2
1
6`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [T, ...cases] = input
  .trim()
  .split("\n")
  .map(Number);

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
  for (let i = 0; i < N; i++) {
    a[i] = a[i] * b[i] % p;
  }

  dft(a, wInvPows, order, p);
  const Ninv = divAndPow(N, p - 2, p);
  for (let i = 0; i < a.length; i++) {
    a[i] = a[i] * Ninv % p;
  }
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
        const oMul = wPows[wPow] * f[j + half + k] % p;
        tmp = (f[j + k] - oMul + p) % p;
        f[j + k] = (f[j + k] + oMul) % p;
        f[j + half + k] = tmp;
        wPow += wPowAcc;
      }
    }
  }
}


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



const maxN = 1000000;
const primes = genPrimes(maxN);
const isPrime = Array(maxN + 1).fill(false);
const f = Array(maxN / 2).fill(0);
for (const p of primes) {
  isPrime[p] = true;
  if (p !== 2) f[(p - 1) / 2] = 1;
}
const ans = convolution(f, f, p, r).slice(0, maxN + 1);
for (const p of primes) if (p < ans.length) ans[p - 1]++;
for (let i = 0; i < ans.length; i++) ans[i] /= 2;
const out = [];
for (const N of cases) {
  if (isPrime[N - 2]) out.push(1);
  else if (N % 2 === 1) out.push(0);
  else out.push(ans[N / 2 - 1]);
}

// output
return out.join("\n");
}
