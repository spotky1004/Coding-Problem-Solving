const isDev = process?.platform !== "linux";
const [[N, M, K, Q], ...input] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`10 11 2 8
1 2
6 7
2 3
3 4
4 6
1 3
4 5
3 6
8 9
6 8
4 10
1 5
1 1 2
1 4 10
2 6 8
2 2 9
2 6 7
3 6 8
3 7 9
3 8 9`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const connections = Array.from({ length: N + 1 }, _ => []);
for (let i = 0; i < M; i++) {
  
}
const X = input[M];

const times = Array(N + 1).fill(-1);
