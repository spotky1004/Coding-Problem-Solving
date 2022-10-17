const isDev = process.platform !== "linux";
const [[N, K]] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`5 2
`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const prime = 1_000_000_007n;

function fact(n) {
  let out = 1n;
  for (let i = 1n; i <= n; i++) {
    out = (out*i) % prime;
  }
  return out;
}

/**
 * @param {BigInt} a 
 * @param {BigInt} b 
 * @param {BigInt} p
*/
function divAndPow(a, b, p) {
  const bin = Array.from(b.toString(2)).reverse();
  let out = 1n;
  let curMul = a;
  for (let i = 0; i < bin.length; i++) {
    if (bin[i] === "1") {
      out = out*curMul % p;
    }
    curMul = curMul**2n % p;
  }
  return out;
}

const out = fact(N) * divAndPow(fact(K)*fact(N-K), prime-2n, prime) % prime;
console.log(out.toString());
