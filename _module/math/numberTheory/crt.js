/**
 * @param {number} a 
 * @param {number} b 
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

/**
 * @param {[x: bigint, m: bigint][]} exprs 
*/
function crt(exprs) {
  let [a1, m1] = exprs[0];
  for (let i = 1; i < exprs.length; i++) {
    let [a2, m2] = exprs[i];
    const g = gcd(m1, m2);
    if ((a2 - a1) % g !== 0n) return null;
    const newM = m1 * m2 / g;
    a1 = (((a1 + m1 * (((a2 - a1) / g) * exGcd(m1 / g, m2 / g, 1n)[0] % (m2 / g))) % newM) + newM) % newM;
    m1 = newM;
  }
  return [a1, m1];
}
