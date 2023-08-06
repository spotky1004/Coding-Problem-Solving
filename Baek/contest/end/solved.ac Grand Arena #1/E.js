const isDev = process?.platform !== "linux";
const [[N, K], A] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`5 4
1 2 3 4 5`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(BigInt));

/**
 * @param {BigInt} a 
 * @param {BigInt} b 
 * @param {BigInt} p
*/
function divAndPow(a, b, p) {
  if (b === 0n) return 1n;
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



const p = 1_000_000_007n;

const modCounts = Array(Number(K)).fill(0n);
for (let i = 0; i < N; i++) {
  modCounts[Number(A[i] % K)]++;
}
if (K % 2n === 0n) modCounts[Math.ceil(Number(K) / 2)]--;
modCounts[0]--;
console.log(modCounts);

let out = divAndPow(2n, N, p);
for (let i = 0; i <= Math.ceil(Number(K - 1n) / 2); i++) {
  if (modCounts[i] <= 0n) continue;
  const modCount = modCounts[i];
  out = (out * (modCount + 2n)) * divAndPow(divAndPow(2n, modCount + 1n, p), p - 2n, p) % p;
}
out -= N + 1n;
console.log(((out + p) % p) + "");
