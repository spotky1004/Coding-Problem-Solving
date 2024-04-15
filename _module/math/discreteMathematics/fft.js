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
