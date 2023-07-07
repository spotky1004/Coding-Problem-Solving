const isDev = process?.platform !== "linux";
const [[P], ...students] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`5
1 3 5
2 1 10
2 2 12
2 4 8
3 3 10`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const counter = [0, 0, 0, 0];
for (const [g, c, n] of students) {
  if (g === 1) {
    counter[3]++;
    continue;
  }
  counter[Math.max(c - 2, 0)]++;
}
console.log(counter.join("\n"));
