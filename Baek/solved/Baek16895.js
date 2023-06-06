const isDev = process?.platform !== "linux";
const [[N], P] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`3
1 2 3`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

if (P.reduce((a, b) => a ^ b, 0) === 0) {
  console.log(0);
  process.exit(0);
}

let count = 0;
for (let i = 0; i < N; i++) {
  let g = 0;
  for (let j = 0; j < N; j++) {
    if (i === j) continue;
    g ^= P[j];
  }
  if (P[i] >= g) count++;
}

console.log(count);
