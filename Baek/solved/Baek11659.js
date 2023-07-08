const isDev = process?.platform !== "linux";
const [[N, M], A, ...ranges] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`5 3
5 4 3 2 1
1 3
2 4
5 5`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

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



const sum = prefixSum(A);
const out = [];
for (const [a, b] of ranges) {
  out.push(sum[b - 1] - (sum[a - 2] ?? 0));
}
console.log(out.join("\n"));
