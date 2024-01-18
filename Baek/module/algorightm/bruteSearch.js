/**
 * @param {number} n 
 * @param {(comb: number[]) => void} callback 
 */
function bruteSearcher(n, callback) {
  const MAX = (1 << n) - 1;
  for (let mask = 0; mask <= MAX; mask++) {
    const comb = [];
    for (let b = 0; b < n; b++) {
      if ((1 << b) & mask) comb.push(b);
    }
    callback(comb);
  }
}
