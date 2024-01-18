function genModInv(n, p) {
  const modInv = Array(n + 1);
  modInv[0] = Infinity;
  modInv[1] = 1n;
  const bigN = BigInt(n);
  for (let i = 2n; i <= bigN; i += 1n) {
    modInv[i] = modInv[p % i] * (p - p / i) % p;
  }

  return modInv;
}
