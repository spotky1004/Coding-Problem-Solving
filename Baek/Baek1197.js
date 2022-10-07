const isDev = process.platform !== "linux";
const [[V, E], ...lines] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`3 3
1 2 1
2 3 2
1 3 3
`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

void lines.sort((a, b) => a[2] - b[2]);
