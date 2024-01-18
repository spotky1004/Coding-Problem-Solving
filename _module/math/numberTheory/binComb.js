/**
 * @param {number} n 
*/
function binComb(n) {
  let combs = ["0", "1"];
  for (let i = 1; i < n; i++) {
    combs = ["0", "1"].map(b => combs.map(c => c + b)).flat();
  }
  return combs;
}
