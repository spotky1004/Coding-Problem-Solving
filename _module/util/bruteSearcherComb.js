/**
 * @param {number} n 
 * @param {(comb: number[]) => void} callback 
 */
function combBruteSearcher(n, callback) {
  const maxBit = (1 << n) - 1;
  for (let i = 0; i <= maxBit; i++) {
    const comb = [];
    for (let b = 0; b < n; b++) if (i & (1 << b)) comb.push(b);
    callback(comb);
  }
}
