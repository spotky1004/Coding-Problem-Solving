const isDev = process?.platform !== "linux";
const [[N, M, K]] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`3 5 15`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const isPossible = N + M - 1 <= K;
const arr = Array.from({ length: N }, (_, i) => Array.from({ length: M }, (_, j) => i + j + 1));

console.log(isPossible ? "YES\n" + arr.map(v => v.join(" ")).join("\n") : "NO");
