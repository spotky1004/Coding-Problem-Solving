const isDev = process?.platform !== "linux";
const [[k], [a, b, c, d]] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`-7
-9 -6 -7 -8`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const l = a*k + b;
const r = c*k + d;
console.log(l === r ? "Yes "+l : "No");
