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
