const isDev = process?.platform !== "linux";
const [[N], cards] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`10
6 7 10 12 13 14 15 20 21 22`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

let score = 0;
let prev = -1;
for (const x of cards) {
  if (x - prev !== 1) score += x;
  prev = x;
}

console.log(score);
