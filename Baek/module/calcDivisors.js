/**
 * @param {number[]} factors 
 * @returns {[divisor: number, divisorFactors: [factor: number, pow: number][]]}
*/
function calcDivisors(factors) {
  if (factors.length === 0) return [[1, []]];

  /** @type {Map<number, number>} */
  const factorCountsMap = new Map();
  for (const factor of factors) {
    if (!factorCountsMap.has(factor)) factorCountsMap.set(factor, 0);
    factorCountsMap.set(factor, factorCountsMap.get(factor) + 1);
  }
  
  const divisors = [];
  const factorCounts = [...factorCountsMap.entries()];
  const factorCouter = Array(factorCounts.length).fill(0);
  loop: while (true) {
    let divisor = 1;
    const divisorFactors = [];
    for (let i = 0; i < factorCounts.length; i++) {
      const pow = factorCouter[i];
      if (pow === 0) continue;
      const factor = factorCounts[i][0];

      divisor *= factor ** pow;
      divisorFactors.push([factor, pow]);
    }
    divisors.push([divisor, divisorFactors]);

    factorCouter[0]++;
    for (let i = 0; i < factorCounts.length; i++) {
      if (factorCouter[i] > factorCounts[i][1]) {
        if (i === factorCounts.length - 1) break loop;
        factorCouter[i] = 0;
        factorCouter[i + 1]++;
      }
    }
  }

  return divisors.sort((a, b) => a[0] - b[0]);
}
