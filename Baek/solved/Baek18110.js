const isDev = process?.platform !== "linux";
const [N, ...votes] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`0`
)
  .trim()
  .split("\n")
  .map(Number);

const trimCount = Math.round(N * 0.15);
votes.sort((a, b) => a - b);

let sum = 0;
for (let i = trimCount; i < N - trimCount; i++) {
  sum += votes[i];
}
console.log(N !== 0 ? Math.round(sum / (N - trimCount * 2)) : 0);
