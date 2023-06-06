const isDev = process?.platform !== "linux";
const [[N], P] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`1
2`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

let g = 0;
for (let i = 0; i < N; i++) {
  g ^= P[i];
}
console.log(g !== 0 ? "koosaga" : "cubelover");
