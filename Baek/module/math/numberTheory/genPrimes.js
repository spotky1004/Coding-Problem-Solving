/**
 * @param {number} n 
*/
function genPrimes(n) {
  /** @type {number[]} */
  const primes = [];
  const net = Array(n).fill(true);
  for (let i = 2; i <= n; i++) {
    if (net[i]) primes.push(i);
    for (const p of primes) {
      const a = i * p;
      if (a > n) break;
      net[a] = false;
      if (i % p === 0) break;
    }
  }
  return primes;
}
