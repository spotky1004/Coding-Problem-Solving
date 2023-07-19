const isDev = process?.platform !== "linux";
const [[N, M]] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`1 50`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const K = N >= 2 && M >= 2 ? 4 : N === 1 && M === 1 ? 1 : 2;
const classroom = Array.from({ length: N }, _ => Array(M));
for (let i = 0; i < N; i++) {
  for (let j = 0; j < M; j++) {
    classroom[i][j] = ((j + Math.min(2, K - 1) * (i % 2)) % K) + 1;
  }
}

console.log(`${K}\n${classroom.map(v => v.join(" ")).join("\n")}`);
