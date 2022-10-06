/**
 * @param {number} a 
 * @param {number} b 
*/
function gcd(a, b) {
  return b ? gcd(b, a%b) : a;
}


/**
 * @param  {...number} n 
*/
function lcm(...n) {
  if (n.length === 1) return n[0];
  let v = (n[0] * n[1]) / gcd(n[0], n[1]);
  for (let i = 2; i < n.length; i++) {
    v = (v * n[i]) / gcd(v, n[i]);
  }
  return v;
}
