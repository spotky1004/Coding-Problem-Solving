/**
 * @param {bigint} a 
 * @param {bigint} b 
*/
function gcd(a, b) {
  return b ? gcd(b, a%b) : a;
}

/**
 * Solves "ax + by = n"
 * @param {bigint} a 
 * @param {bigint} b 
 * @param {bigint} n 
 * @returns {[x: bigint, y: bigint]?} 
 */
function exGcd(a, b, n) {
  if (a > b) {
    const value = exGcd(b, a, n);
    if (!value) return null;
    let [y, x] = value;
    if (b !== 0n) {
      let t = -x / b;
      if (t > 0n) t++;
      x += b * t;
      y -= a * t;
    }
    return [x, y];
  }

  if (a === 0n && b === 0n) {
    if (n === 0n) return [0n, 0n];
    return null;
  }
  if (a === 0n) {
    if (gcd(b, n) !== b) return null;
    return [0n, n / b];
  }
  if (b === 0n) {
    if (gcd(a, n) !== a) return null;
    return [n / a, 0n];
  }
  if (n === 0n) return [0n, 0n];

  const aModGcd = gcd(a, b);
  if (n % aModGcd !== 0n) return null;
  
  a /= aModGcd;
  b /= aModGcd;
  n /= aModGcd;
  let [xp, yp] = exGcdImpl(a, b);
  let x = xp * n;
  let y = yp * n;
  let t = -x / b;
  if (t > 0n) t++;
  x += b * t;
  y -= a * t;
  return [x, y];
}

/**
 * @param {bigint} a 
 * @param {bigint} b 
 * @returns {[x: bigint, y: bigint]} 
 */
function exGcdImpl(a, b) {
  if (a < b) return exGcdImpl(b, a);
  const r = a % b;
  const q = (a - r) / b;
  if (r === 0n) return [1n, 0n];
  const [yp, xp] = exGcdImpl(b, r);
  return [xp - q * yp, yp];
}

/**
 * @param {bigint} a 
 * @param {bigint} b 
 * @param {bigint} p
*/
function divAndPow(a, b, p) {
  let out = 1n;
  let curMul = a;
  const loopCount = BigInt(Math.ceil(Math.log2(Number(b))) + 1);
  for (let i = 0n; i < loopCount; i++) {
    if (b & 1n << i) {
      out = out*curMul % p;
    }
    curMul = curMul**2n % p;
  }
  return out;
}

/**
 * @param {bigint} n 
 * @param {bigint} c 
 * @returns {bigint[]} 
 */
function pollardRho(n, c = 1n) {
  n = BigInt(n);
  if (n === 1n || isPrime(n)) return n;
  if (n % 2n === 0n) return 2n;

  function g(x) {
    return (x * x + c) % n;
  }
  
  let a = 2n;
  let b = a;
  while (true) {
    a = g(a);
    b = g(g(b));
    if (a === b) return pollardRho(n, c + 1n);
    const dif = a - b;
    const d = gcd(n, dif > 0 ? dif : -dif);
    if (d === 1n) continue;
    return d;
  }
}

const millerRabinPrimes = [
  2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n,
  31n, 37n, 41n, 43n, 47n, 53n, 59n, 61n, 67n, 71n
];
/**
 * @param {bigint} n 
 * @returns {boolean} 
*/
function isPrime(n) {
  if (n === 2n) return true;
  if (n < 2n) return false;

  n = BigInt(n);
  d = n - 1n;

  let r = 0n;
  while ((d & 1n) === 0n) {
    r++;
    d /= 2n;
  }

  l: for (const p of millerRabinPrimes) {
    if (n === p) return true;
    if (divAndPow(p, d, n) === 1n) continue;
    for (let i = 0n; i < r; i++) {
      if (divAndPow(p, 2n**i * d, n) === n - 1n) continue l;
    }
    return false;
  }
  return true;
}

/**
 * @param {bigint} n 
 */
function primeFactorization(n) {
  if (n <= 3n) return [n];
  const toFactorization = [n];
  const factors = [];
  for (const n of toFactorization) {
    if (isPrime(n)) {
      factors.push(n);
      continue;
    }
    const p = pollardRho(n);
    const q = n / p;
    if (isPrime(p)) factors.push(p);
    else if (p !== 1n) toFactorization.push(p);
    if (isPrime(q)) factors.push(q);
    else if (q !== 1n) toFactorization.push(q);
  }
  return factors.sort((a, b) => Number(a - b));
}

/**
 * @param {bigint} n 
 * @param {bigint[]} factors 
*/
function eularPhi(n, factors) {
  let out = n;
  for (const factor of [...new Set(factors)]) {
    out -= out / factor;
  }
  return out;
}

/**
 * @param {bigint} x 
 * @param {bigint} n 
 * @param {bigint[]} phiNFactorization 
 */
function calcOrder(x, n, phiNFactorization) {
  if (gcd(x, n) !== 1n) return -1n;
  
  let order = phiNFactorization.reduce((a, b) => a * b, 1n);

  for (const p of phiNFactorization) {
    if (divAndPow(x, order / p, n) !== 1n) continue;
    order /= p;
  }

  return order;
}

/**
 * @param {bigint} n 
 * @param {bigint} phiN 
 */
function findPrimitiveRoot(n, phiN) {
  const phiNFactorization = primeFactorization(phiN);
  let g = 2n;
  while (true) {
    const result = calcOrder(g, n, phiNFactorization);
    if (result === phiN) return g;
    g++;

    if (g === n) break;
  }
  return -1n;
}

/**
 * @param {bigint} n 
 */
function genLogSolver(n) {
  const isNPrime = isPrime(n);
  const phiN = eularPhi(n, primeFactorization(n));
  const g = findPrimitiveRoot(n, phiN);

  const sqrtPhiN = BigInt(Math.ceil(Math.sqrt(Number(phiN))));

  /** @type {bigint[]} */
  const pow1 = Array(Number(sqrtPhiN));
  pow1[0] = 1n;
  for (let i = 1; i < pow1.length; i++) {
    pow1[i] = pow1[i - 1] * g % n;
  }
  /** @type {bigint[]} */
  const pow2 = Array(Math.ceil(Number(phiN) / Number(sqrtPhiN)));
  pow2[0] = 1n;
  pow2[1] = pow1[pow1.length - 1] * g % n;
  for (let i = 2; i < pow2.length; i++) {
    pow2[i] = pow2[i - 1] * pow2[1] % n;
  }
  
  /**
   * Solves "g^? = x"
   * @param {bigint} x 
   */
  function log(x) {
    /** @type {Map<bigint, bigint>} */
    const r = new Map();
    let t = 0n;
    for (let i = 0; i < pow1.length; i++) {
      let value = x * pow1[t];
      if (value > n) value %= n;
      r.set(value, t);
      t++;
    }

    t = -1n;
    for (let i = 0; i < pow2.length; i++) {
      t++;

      const l = pow2[i];
      if (!r.has(l)) continue;
      return t * sqrtPhiN - r.get(l);
    }

    return -1n;
  }

  /**
   * Solves "?^r = x"
   * @param {bigint} x 
   * @param {bigint} r root
   */
  function sqrt(x, r = 2n) {
    if (!isNPrime) return -1n;

    // "?^r = x (mod n)" -> "g^(ur) = g^v (mod n)" -> "g^(ur - v) = 1 (mod n)" -> "ur = v (mod phi(n))"
    const v = log(x);
    const exGcdVal = exGcd(r, phiN, v);
    if (exGcdVal === null) return -1n;
    const [u] = exGcdVal;
    
    return divAndPow(g, u, n);
  }

  return { g, log, sqrt };
}

const n = 1000000007n;
const x = 12345n;
const { g, log, sqrt } = genLogSolver(n);
const k = log(x);
const r = 20n;
const a = sqrt(x, r);
console.log(`g^k ≡ x (mod n); n = ${n}, x = ${x} -> g = ${g}, k = ${k}`);
console.log(`a^r ≡ x (mod n); n = ${n}, r = ${r}, x = ${x} -> a = ${a}`);
