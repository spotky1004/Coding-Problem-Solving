/**
 * @param {number} a 
 * @param {number} b 
 */
function gcd(a, b) {
  return b ? gcd(b, a%b) : a;
}
