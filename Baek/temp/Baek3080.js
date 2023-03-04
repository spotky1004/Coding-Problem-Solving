const isDev = process.platform !== "linux";
const names = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`3
IVO
JASNA
JOSIPA`
)
  .trim()
  .split("\n")
  .slice(1)
  .sort();

let watchingFactors = [0];
const factors = [0];
const factorBits = [0];
for (let i = 0; i < names.length; i++) {
  const prevName = names[i - 1] ?? "";
  const curName = names[i];

  let wasSame = true;
  for (let j = 0; j < curName.length + 1; j++) {
    if (wasSame && prevName[j] === curName[j]) continue;
    wasSame = false;
    if (watchingFactors.length > j) {
      watchingFactors = watchingFactors.slice(0, j + 1);
    }
    
    const charIdx = curName[j] ? parseInt(curName[j], 36) - 10 : 26;
    watchingFactors.push(factors.length);
    factors.push(0);
    factorBits.push(0);

    const curFactorIdx = watchingFactors[watchingFactors.length - 2];
    if (typeof curFactorIdx === "undefined") continue;
    const el = 1<<charIdx;
    if ((factorBits[curFactorIdx]>>charIdx)&1) continue;
    factorBits[curFactorIdx] = factorBits[curFactorIdx] | el;
    factors[curFactorIdx]++;
  }
}

const p = 1_000_000_007n;
const factroial = [1n];
for (let i = 1n; i < 3001n; i++) {
  factroial[i] = (factroial[Number(i) - 1] * i) % p;
}

let combs = 1n;
for (const factor of factors.filter(v => v > 1)) {
  combs = (combs * factroial[factor]) % p;
}
console.log(combs.toString());
