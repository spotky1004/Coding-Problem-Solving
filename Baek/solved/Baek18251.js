const isDev = process?.platform !== "linux";
const [[N], W] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`7
10 -15 -1 4 3 -7 9`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const height = Math.log2(N + 1);
function search(s, e, curNode = 1, depth = 0, arr = []) {
  if (depth < height) {
    search(s, e, curNode * 2    , depth + 1, arr);
  }
  if (s <= depth && depth <= e) arr.push(W[curNode - 1]);
  if (depth < height) {
    search(s, e, curNode * 2 + 1, depth + 1, arr);
  }

  return arr;
}

let max = -Infinity;
for (let e = 0; e < height; e++) {
  for (let s = e; s >= 0; s--) {
    const arr = search(s, e);
    let prevSum = arr[0];
    let maxSum = arr[0];
    for (let i = 1; i < arr.length; i++) {
      const v = arr[i];
      if (v > 0) {
        if (prevSum < 0) prevSum = v;
        else prevSum += v;
      } else {
        prevSum += v;
      }

      maxSum = Math.max(maxSum, prevSum);
    }
    max = Math.max(max, maxSum);
  }
}

console.log(max);
