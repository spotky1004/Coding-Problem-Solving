/**
 * @param {number} n 
 * @param {(comb: number[]) => void} callback 
 */
function bruteSearcher(n, callback) {
  const comb = [];
  function impl(i = 0) {
    callback(comb);
    if (i >= n) return;
    impl(i + 1);
    comb.push(i);
    impl(i + 1);
    comb.pop();
  }
  impl();
}
