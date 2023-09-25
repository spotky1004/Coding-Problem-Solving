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
  const aModGcd = gcd(a, n);
  if (b % aModGcd !== 0n) return null;
  
  a /= aModGcd;
  b /= aModGcd;
  n /= aModGcd;
  let [xp, yp] = exGcdImpl(a, b);
  let x = xp * n;
  let y = yp * n;
  const t = -x / b + 1n;
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
  if (r === 0n) return [0n, 1n];
  const [xp, yp] = exGcdImpl(b, r);
  return [xp - q * yp, yp];
}

const [a, b, n] = [1n, 1n, 1n];
const [x, y] = exGcd(a, b, n);
console.log(`${a}x + ${b}y = ${n} -> x = ${x}, y = ${y}`);
