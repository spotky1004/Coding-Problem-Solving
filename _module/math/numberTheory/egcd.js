/**
 * Solves "ax + by = n"
 * @param {bigint} a 
 * @param {bigint} b 
 * @param {bigint} n 
 * @returns {[x: bigint, y: bigint, xShift: bigint, yShift: bigint]?} 
*/
function egcd(a, b, c) {
  const aSign = a >= 0 ? 1 : -1;
  const bSign = b >= 0 ? 1 : -1;
  if (a < 0) a *= -1;
  if (b < 0) b *= -1;

  if (a === 0 && b === 0) {
    if (c === 0) return [0, 0, 1, 1];
    return null;
  }
  if (a === 0) {
    if (c % b !== 0) return null;
    return [0, Math.floor(c / b) * bSign, 0, Math.floor(c / b) * bSign];
  }
  if (b === 0) {
    if (c % a !== 0) return null;
    return [Math.floor(c / a) * aSign, 0, Math.floor(c / a) * aSign, 0];
  }
  
  let r0 = a, r1 = b;
  let x0 = 1, x1 = 0, y0 = 0, y1 = 1;
  let q = 0, tmp;
  while (r1 > 0) {
    q = Math.floor(r0 / r1);
    tmp = r0;
    r0 = r1, r1 = tmp - r1 * q;
    tmp = x0;
    x0 = x1, x1 = tmp - x1 * q;
    tmp = y0;
    y0 = y1, y1 = tmp - y1 * q;
  }

  const gcd = r0;
  if (c % gcd !== 0) return null;
  const mul = Math.floor(c / gcd);
  let x = x0 * mul, y = y0 * mul;
  let xp = Math.floor(b / gcd), yp = Math.floor(-a / gcd);
  if (xp !== 0) {
    let offset = Math.floor(x / xp);
    if (x - xp * offset < 0) offset--;
    x -= xp * offset;
    y -= yp * offset;
  }

  return [x * aSign, y * bSign, xp * aSign, yp * bSign];
}
