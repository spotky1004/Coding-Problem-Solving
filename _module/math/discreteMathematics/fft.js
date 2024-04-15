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
  for (let i = 0; i < aPadLen; i++) a.push(0);
  for (let i = 0; i < bPadLen; i++) b.push(0);

  const w = calcNthRootOfUnity(N);
  const aDft = dft(a.map(Complex), w);
  const bDft = dft(b.map(Complex), w);
  const cDft = [];
  for (let i = 0; i < N; i++) {
    cDft.push(cMul(aDft[i], bDft[i]));
  }

  const cIdft = dft(cDft, cInv(w));
  const out = [];
  for (let i = 0; i < outLen; i++) {
    out.push(Math.round(cIdft[i][0] / N));
  }

  if (aPadLen !== 0) a.splice(N - aPadLen);
  if (bPadLen !== 0) b.splice(N - bPadLen);
  return out;
}

/**
 * @param {number[]} a 
 * @param {Complex} w 
*/
function dft(a, w) {
  const N = a.length;
  if (N === 1) return a;

  const e = [], o = [];
  for (let i = 0; i < N; i++) {
    if (i % 2) o.push(a[i]);
    else e.push(a[i]);
  }

  const wPow = cMul(w, w);
  const halfN = N / 2;

  const eDft = dft(e, wPow);
  const oDft = dft(o, wPow);
  const aResult = [];
  const sResult = [];
  let wTmp = [1, 0];
  for (let i = 0; i < halfN; i++) {
    const oMul = cMul(wTmp, oDft[i]);
    aResult.push(cAdd(eDft[i], oMul));
    sResult.push(cSub(eDft[i], oMul));
    wTmp = cMul(wTmp, w);
  }

  for (const c of sResult) aResult.push(c);
  return aResult;
}
