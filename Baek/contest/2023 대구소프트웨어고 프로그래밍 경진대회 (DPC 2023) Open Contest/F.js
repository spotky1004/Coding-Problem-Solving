const isDev = process?.platform !== "linux";
const [[N, a]] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`4 3`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(BigInt));

const p = 1_000_000_007n;
/**
 * @param {BigInt} a 
 * @param {BigInt} b 
 * @param {BigInt} p
*/
function divAndPow(a, b) {
  if (b === 0n) return a;
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



let sum = (N - 1n) * divAndPow(N, a);
for (let i = a - 1n; i >= 1n; i--) {
  sum += (N - 1n) * (N - 2n) * divAndPow(N, i) * divAndPow(N - 1n, a - i - 1n);
}
console.log(sum % p);
