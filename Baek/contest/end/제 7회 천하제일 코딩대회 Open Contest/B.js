const isDev = process?.platform !== "linux";
const [[N, K], w] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`6 10
9 5 6 7 4 3`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

w.sort((a, b) => a - b);

let count = 0;
let l = 0;
let r = N - 1;
while (l < r) {
  if (w[l] + w[r] > K) {
    r--;
    continue;
  }
  count++;
  l++;
  r--;
}

console.log(count);
