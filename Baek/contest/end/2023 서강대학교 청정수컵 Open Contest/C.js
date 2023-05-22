const isDev = process?.platform !== "linux";
const [[N], [x, y]] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`4
2 1`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

if (N === 1) {
  console.log(0);
} else if (
  (x === 1 || x === N) &&
  (y === 1 || y === N)
) {
  console.log(2);
} else if (
  x === 1 || x === N ||
  y === 1 || y === N
) {
  console.log(3);
} else {
  console.log(4);
}
