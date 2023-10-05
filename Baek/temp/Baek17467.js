const isDev = process?.platform !== "linux";
const [[N, p]] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`4 7`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(BigInt));

/**
 * @param {BigInt} a 
 * @param {BigInt} b 
 * @param {BigInt} p
*/
function divAndPow(a, b) {
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

let out = 1n;

out *= divAndPow(2n, N / 2n);
out *= divAndPow(3n, N / 3n - N / 6n);
out *= divAndPow(5n, N / 5n - N / 10n - N / 15n + N / 30n);

const pattern = Array(30).fill(true);
