/**
 * @param {number} n 
 * @param {number} r 
 * @param {number} p
 * @param {number[]} factroials
*/
function combination(n, r, p, factroials) {
  return factroials[n] * divAndPow(factroials[n - r] * factroials[r], p - 2, p) % p;
}
