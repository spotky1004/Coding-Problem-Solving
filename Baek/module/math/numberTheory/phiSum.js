const phiSumCount = 5_000_000;
const phiSums = genPhi(phiSumCount);
const numP = Number(p);
for (let i = 1; i <= phiSumCount; i++) {
  phiSums[i] = (phiSums[i - 1] + phiSums[i]) % numP;
}
const phiSumCache = new Map();
function clacPhiSum(n) {
  if (n <= phiSumCount) return BigInt(phiSums[n]);
  if (phiSumCache.has(n)) return phiSumCache.get(n);

  let sum = (n * (n + 1n) / 2n) % p;
  let s = 1n, a = n / s, e = n / a;
  while (s <= n) {
    s = e + 1n;
    if (s > n) break;
    a = n / s;
    e = n / a;

    sum -= clacPhiSum(a) * (e - s + 1n);
  }

  sum = ((sum % p) + p) % p;
  phiSumCache.set(n, sum);

  return sum % p;
}