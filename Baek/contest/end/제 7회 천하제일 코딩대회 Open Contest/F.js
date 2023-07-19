const isDev = process?.platform !== "linux";
let [[N, K], A] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`4 80
80 100 50 40`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(BigInt));
N = Number(N);

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

function lowerBound(arr, v) {
  let left = -1, right = arr.length;
  while (left + 1 < right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] >= v) left = mid;
    else right = mid;
  }
  return right;
}



A.sort((a, b) => Number(b - a));
const aSum = prefixSum(A);

let l = 0n;
let r = 10n ** 12n;
let [prevL, prevR] = [l, r];
while (true) {
  const m = (l + r) / 2n;
  
  const lastPositiveIdx = lowerBound(A, m);
  const candies = (aSum[lastPositiveIdx - 1] ?? 0n) - m * BigInt(lastPositiveIdx);
  if (candies > K) l = m;
  else r = m;

  if (prevL === l && prevR === r) break;
  [prevL, prevR] = [l, r];
}
console.log(r + "");
