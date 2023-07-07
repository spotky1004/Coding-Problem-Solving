const isDev = process?.platform !== "linux";
const [[N]] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`8`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const maxNums = [null, 1, 1, 2, 2, 2];
console.log(maxNums[N] ?? 3);
