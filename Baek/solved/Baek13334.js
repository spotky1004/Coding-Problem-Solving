const isDev = process?.platform !== "linux";
let [, ...lines] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`8
5 40
35 25
10 20
10 25
30 50
50 60
30 25
80 100
30`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number).sort((a, b) => a - b));

const d = lines.pop()[0];

lines = lines.filter(([h, o]) => o - h <= d);
lines.sort((a, b) => a[0] - b[0]);

/** @type {number[]} */
const sortedHIdx = [...lines].map((v, i) => [v, i]).sort((a, b) => a[0][1] - b[0][1]).map(v => v[1]);

let max = 0;
let right = 0;
for (let i = 0; i < lines.length; i++) {
  const curLeft = lines[i][0];
  const curRight = curLeft + d;
  while (
    lines[sortedHIdx[right + 1]] &&
    lines[sortedHIdx[right + 1]][1] <= curRight
  ) {
    right++;
  }
  max = Math.max(max, right - i + 1);
}

console.log(max);
