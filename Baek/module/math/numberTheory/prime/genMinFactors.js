/**
 * @param {number} n 
 */
function genMinFactors(n) {
  const minFactors = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 4; i <= n; i += 2) {
    minFactors[i] = 2;
  }
  for (let i = 3; i <= n; i += 2) {
    if (minFactors[i] !== i) continue;
    let mul = i * 3;
    while (mul <= n) {
      if (minFactors[mul] === mul) minFactors[mul] = i;
      mul += i * 2;
    }
  }
  return minFactors;
}