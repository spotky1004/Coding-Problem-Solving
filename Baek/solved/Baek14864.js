const isDev = process?.platform !== "linux";
const [[N, M], ...pairs] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`5 5
1 2
1 5
3 4
3 5
4 5`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const out = Array.from({ length: N }, (_, i) => i + 1);
for (const [x, y] of pairs) {
  out[y - 1]--;
  out[x - 1]++;
}

const isDupe = new Set(out).size !== N;
console.log(isDupe ? -1 : out.join(" "));
