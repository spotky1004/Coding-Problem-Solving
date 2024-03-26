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
