const isDev = process?.platform !== "linux";
const [[N, C], weights] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`30 30
1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 2`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(BigInt));

const halfN = Math.ceil(Number(N) / 2);
const left = weights.slice(0, halfN);
const right = weights.slice(halfN);

let arrIdx = 0;
function getSums(arr, sumArr, sum = 0n, idx = -1) {
  if (idx !== -1) {
    sumArr[arrIdx] = sum;
    arrIdx++;
  }
  for (let i = idx + 1; i < arr.length; i++) {
    getSums(arr, sumArr, sum + arr[i], i);
  }
}

const leftSums = new BigInt64Array(Math.max(0, 2**left.length - 1));
const rightSums = new BigInt64Array(Math.max(0, 2**right.length - 1));
arrIdx = 0;
getSums(left, leftSums);
arrIdx = 0;
getSums(right, rightSums);
leftSums.sort((a, b) => Number(a - b));
rightSums.sort((a, b) => Number(a - b));

let counts = 1;
for (const a of leftSums) {
  const spaceLeft = C - a;
  if (spaceLeft < 0) continue;
  
  let left = -1, right = rightSums.length;
  while (left + 1 < right) {
    const mid = Math.floor((left + right) / 2);
    if (!(rightSums[mid] > spaceLeft)) left = mid;
    else right = mid;
  }
  counts += right + 1;
}
for (const b of rightSums) {
  if (b <= C) counts++;
}
console.log(counts);
