const isDev = process?.platform !== "linux";
const [[n]] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`12`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

/**
 * @param {number} n 
*/
function genPrimes(n) {
  /** @type {(number | null)[]} */
  const net = Array.from({ length: n }, (_, i) => i);
  net[0] = null;
  net[1] = null;
  for (let i = 4; i < net.length; i += 2) {
    net[i] = null;
  }
  for (let i = 3; i < net.length; i++) {
    if (net[i] === null) continue;
    for (let j = i * 3; j < net.length; j += i * 2) {
      net[j] = null;
    }
  }
  return net.filter(v => v !== null);
}

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



const primes = genPrimes(1e4);

const r = (-n - 1) / (2 * n);
const sq = Math.sqrt(5*n**2 + 10*n + 1) / (2 * n);
const sols = [r + sq, r - sq];
const factors = calcDivisors(primeFactorization(n, primes)).map(v => v[0]);

for (const f of factors) {
  const g = n / f;

  const s1 = -sols[0] * f;
  const s2 = -sols[1] * g;
  if (
    Math.abs(s1 - Math.round(s1)) < 0.000001 &&
    Math.abs(s2 - Math.round(s2)) < 0.000001
  ) {
    console.log(`${f} ${Math.round(s1)} ${g} ${Math.round(s2)}`);
    process.exit(0);
  }
}
console.log(-1);
