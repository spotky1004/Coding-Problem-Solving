const isDev = process?.platform !== "linux";
const [[a, b]] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`4 10`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

console.log(Math.max(1, Math.ceil(Math.log10(a) * b)));
