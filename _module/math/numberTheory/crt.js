/**
 * @param {bigint[]} a 
 * @param {bigint[]} n 
*/
function crt(a, n) {
  let value = a[0];
  let mod = n[0];
  for (let i = 1; i < a.length; i++) {
    let ai = a[i], ni = n[i];
    const g = gcd(mod, ni);
    value = ((ai - value) % mod + mod) % mod;
    if (value % g !== 0n) return null;
    const div = gcd(gcd(mod, ni), value);
    value /= div;
    ni /= div;
    mod /= div;

    const result = exGcd(mod, ni, value);
    if (result === null) return null;
    console.log(result);
  }
  return [value, mod];
}
console.log(crt([17n, 23n], [42n, 60n]));

/**
 * @param {bigint} a 
 * @param {bigint} b 
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
