const isDev = process?.platform !== "linux";
const [[N], A] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`8
0 2 0 1 3 2 1 0`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const zeroCount = A.filter(v => v === 0).length;
const oneCount = A.filter(v => v === 1).length;

const zeroCounts = [];
let curCount = 0;
for (let i = 0; i < N; i++) {
  if (A[i] === 0) curCount++;
  zeroCounts.push(curCount);
}

const twoCounts = [];
curCount = 0;
for (let i = 0; i < N; i++) {
  if (A[i] >= 2) curCount++;
  twoCounts.push(curCount);
}

let sum = 2 * (zeroCount * oneCount);
for (let i = 0; i < N; i++) {
  if (A[i] === 1) continue;
  if (A[i] === 0) {
    sum += zeroCounts[N - 1] - zeroCounts[i];
    sum += twoCounts[N - 1] - twoCounts[i];
  } else {
    sum += zeroCounts[N - 1] - zeroCounts[i];
  }
}

console.log(sum);
