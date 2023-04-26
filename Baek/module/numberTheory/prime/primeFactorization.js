/**
 * @param {number} n 
 * @param {number[]} primes 
*/
function primeFactorization(n, primes) {
  const factrors = [];

  const tryFor = Math.ceil(Math.sqrt(n));
  for (const p of primes) {
    if (p > tryFor || p > n) break;
    if (n % p !== 0) continue;
    while (n % p === 0) {
      n /= p;
      factrors.push(p);
    }
  }
  if (n !== 1) factrors.push(n);
  
  return factrors;
}
