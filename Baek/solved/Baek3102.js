const isDev = process?.platform !== "linux";
const [[N], ...circles] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`6
2 1
5 1
6 1
1 2
3 2
4 3`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

circles.sort((a, b) => {
  const cDiff = a[0] - b[0];
  if (cDiff !== 0) return cDiff;
  return a[1] - b[1];
});

const fieldOffset = 101;
const fieldSize = 305;
const lines = Array.from({ length: fieldSize }, _ => Array(fieldSize).fill(false));
for (const [c, r] of circles) {
  const [a, b] = [c - r + fieldOffset, c + r + fieldOffset];
  lines[a][b] = true;
  lines[b][a] = true;
}

const dp = Array.from({ length: fieldSize }, _ => Array(fieldSize).fill(0));
for (let i = 0; i < fieldSize; i++) {
  for (let j = 0; j < fieldSize - i; j++) {
    const a = j;
    const b = i + j;
    let isFit = lines[a][b] ? 1 : 0;

    let max = 0;
    for (let i = a; i <= b; i++) {
      max = Math.max(max, dp[a][i] + dp[i][b]);
    }
    dp[a][b] = max + isFit;
    dp[b][a] = max + isFit;
  }
}
console.log(N - Math.max(...dp.flat()));
