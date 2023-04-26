/**
 * @param {number} n 
 * @param {number[]} factors 
*/
function eularPhi(n, factors) {
  let out = n;
  for (const factor of factors) {
    out -= out / factor;
  }
  return out;
}
