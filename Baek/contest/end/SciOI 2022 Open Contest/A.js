const isDev = process?.platform !== "linux";
const [[N], cards] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`4
1 2 3 1`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const numCounts = Array(N + 1).fill(0n);
for (const card of cards) {
  numCounts[card]++;
}

let winCases = 1n;
const p = 1_000_000_007n;
for (const numCount of numCounts) {
  const m = numCount + 1n;
  winCases = (m%p * winCases)%p;
}

console.log((winCases-1n)%p + "");
