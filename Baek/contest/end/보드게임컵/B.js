const isDev = process?.platform !== "linux";
const [[N], ...cards] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`3
BANANA 2
PLUM 4
BANANA 3`
)
  .trim()
  .split("\n")
  .map(line => line.split(" "));

const fruits = {
  "STRAWBERRY": 0,
  "BANANA": 1,
  "LIME": 2,
  "PLUM": 3
};
const counts = [0, 0, 0, 0];

for (const [s, x] of cards) {
  counts[fruits[s]] += Number(x);
}

console.log(counts.includes(5) ? "YES" : "NO");
