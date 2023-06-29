const isDev = process?.platform !== "linux";
const [[X, Y, D, T]] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`10 10 1000 5`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const dist = Math.sqrt(X**2 + Y**2);
const t = Math.floor(dist / D);
const tDist = t * D;

console.log(Math.min(
  dist,
  dist - tDist + t * T,
  (tDist + D - dist) + (t + 1) * T,
  Math.max(2, t + 1) * T
));
