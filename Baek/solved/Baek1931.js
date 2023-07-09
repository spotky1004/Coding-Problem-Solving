const isDev = process?.platform !== "linux";
const [[N], ...ranges] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`11
1 4
3 5
0 6
5 7
3 8
5 9
6 10
8 11
8 12
2 13
12 14`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

ranges.sort((a, b) => {
  const eDiff = a[1] - b[1];
  if (eDiff !== 0) return eDiff;
  return a[0] - b[0];
});

let count = 0;
let t = 0;
for (const [s, e] of ranges) {
  if (s < t) continue;
  count++;
  t = e;
}
console.log(count);
