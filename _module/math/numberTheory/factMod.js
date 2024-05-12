/**
 * @param {number} n 
 * @param {number} m 
*/
function factMod(n, m) {
  const mul = (x, y) => {
    const xl = x >> 1, xr = x - xl, yl = y >> 1, yr = y - yl;
    let out = xl * yl + xl * yr + xr * yl;
    out -= m * Math.floor(out / m);
    out += xr * yr;
    out -= m * Math.floor(out / m);
    return out;
  }
  
  let out = 1;
  for (let i = 2; i <= n; i += 2) {
    out = mul(out, mul(i, i - 1));
  }
  for (let i = Math.floor(n / 2) * 2 + 1; i <= n; i++) {
    out = mul(out, i);
  }
  
  return out % P;
}
