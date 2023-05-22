const isDev = process?.platform !== "linux";
const [[N], T] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`3
10 11 11`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const t = T.reduce((a, b) => a + b + 8);
console.log(`${~~(t/24)} ${t%24}`);
