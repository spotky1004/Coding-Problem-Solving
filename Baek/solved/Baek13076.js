const isDev = process?.platform !== "linux";
const [t, ...N] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`4
6
15
57
9999`
)
  .trim()
  .split("\n")
  .map(line => Number(line));

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
 * @param {number} n 
 * @param {number[]} factors 
 */
function eularPhi(n, factors) {
  let out = n;
  for (const factor of factors) {
    out -= out / factor;
  }
  return out;
}

/**
 * @param {number[]} arr
*/
function prefixSum(arr) {
  if (arr.length === 0) return [];

  const sumArr = [arr[0]];
  for (let i = 1; i <= arr.length; i++) {
    sumArr[i] = sumArr[i - 1] + arr[i];
  }
  return sumArr;
}

const primes = genPrimes(10000);
const eularPhis = [1, 1];
for (let i = 2; i <= 10000; i++) {
  eularPhis.push(eularPhi(i, [...new Set(primeFactorization(i, primes))]));
}
const sumArr = prefixSum(eularPhis);

const out = N.map(n => sumArr[n]);
console.log(out.join("\n"));
