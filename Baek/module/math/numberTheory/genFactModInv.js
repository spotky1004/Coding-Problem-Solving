function genFactModInv(n, modInv, p) {
  const factorialModInv = Array(n + 1);
  factorialModInv[0] = 1n;
  factorialModInv[1] = 1n;
  const bigN = BigInt(n);
  for (let i = 2n; i <= bigN; i += 1n) {
    factorialModInv[i] = factorialModInv[i - 1n] * modInv[i] % p;
  }

  return factorialModInv;
}
