const isDev = process?.platform !== "linux";
const [, scovilles] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`6
1 4 5 5 6 10`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(BigInt));
const N = scovilles.length;

/**
 * @param {number[]} arr
*/
function prefixSum(arr) {
  if (arr.length === 0) return [];

  const sumArr = [arr[0]];
  for (let i = 1; i < arr.length; i++) {
    sumArr[i] = sumArr[i - 1] + arr[i];
  }
  return sumArr;
}



const p = 1_000_000_007n;

scovilles.sort((a, b) => Number(a - b));

const twoPows = [1n];
for (let i = 1; i <= N; i++) {
  twoPows[i] = (twoPows[i - 1] * 2n) % p;
}

const prefixSumScovilles = prefixSum(scovilles);

let out = 0n;
for (let i = 1; i <= N - 1; i++) {
  const acc = prefixSumScovilles[N - 1] - prefixSumScovilles[i - 1] - prefixSumScovilles[N - 1 - i];
  out = (out + acc * twoPows[i - 1]) % p;
}

console.log(out + "");
