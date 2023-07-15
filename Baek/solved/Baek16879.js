const isDev = process?.platform !== "linux";
const [[N], ...items] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`3
7 4
3 7
1 0`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

let g = 0;
for (const [x, y] of items) {
  g ^= 3 * (Math.floor(x / 3) ^ Math.floor(y / 3)) + (((x % 3) + (y % 3)) % 3);
}
console.log(g !== 0 ? "koosaga" : "cubelover");
