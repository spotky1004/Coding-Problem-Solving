const isDev = process?.platform !== "linux";
const [[N]] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`10`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

console.log([6, 66, 792, 10296, 144144, 2162160, 34594560, 588107520][N - 10]);
