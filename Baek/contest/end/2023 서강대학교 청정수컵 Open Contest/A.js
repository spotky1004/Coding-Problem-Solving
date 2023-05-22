const isDev = process?.platform !== "linux";
const [[N], a] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`3
2 3 4`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const canCarry = a.map((v, i) => Math.max(0, v - N + i));
let max = 0;
for (const lemon of canCarry) {
  max = Math.max(max, lemon);
}

console.log(max);
