function factorial(n, p) {
  if (n <= 1n) return 1n;
  return factorial(n / 2n, p)**2n * primeSwing(n, p) % p;
}

function primeSwing(n, p) {
  const factorPows = [];
  for (const prime of primes) {
    if (n < prime) break;
    let q = n, pow = 1n;
    while (q !== 0n) {
      q = q / prime;
      if (q % 2n === 1n) pow = (pow * prime) % p;
    }
    factorPows.push(pow);
  }

  let idx = 0;
  function product(len) {
    if (len === 0) return 1n;
    if (len === 1) return factorPows[idx++];
    const halfLen = Math.floor(len / 2);
    return (product(len - halfLen) * product(halfLen)) % p;
  }

  return product(factorPows.length);
}
