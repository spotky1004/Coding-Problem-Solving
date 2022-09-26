const isDev = process.platform !== "linux";
const n = BigInt(
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`1000
`
);

const prime = 1_000_000_007n;

const dp = new Map([
  [0n, 0n],
  [1n, 1n],
  [2n, 1n],
  [3n, 2n]
]);

/**
 * @param {BigInt} n 
 */
function fib(n) {
  const saved = dp.get(n);
  if (typeof saved !== "undefined") return saved;
  /** @type {BigInt} */
  let result;
  if (n%2n === 0n) {
    result = ((fib(n/2n - 1n) + fib(n/2n + 1n)) * fib(n/2n)) % prime;
  } else {
    const half = (n+1n)/2n;
    const a = fib(half);
    const b = fib(half - 1n);
    result = (a*a + b*b) % prime;
  }
  void dp.set(n, result);
  return result;
}

console.log(fib(n).toString());
