const isDev = process.platform !== "linux";
const input = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`10 3 3
1 2 3
1 2 1
2 3 1
3 4 1
4
5
6`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

