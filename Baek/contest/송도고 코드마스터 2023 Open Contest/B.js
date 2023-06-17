const isDev = process?.platform !== "linux";
const [[n, m, k], ...classrooms] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`4 3 3
1 1
3 3
4 3`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

let minDist = Infinity;
let minIdx = -1;
for (let i = 0; i < classrooms.length; i++) {
  const [f, d] = classrooms[i];
  const dist = m + f - d;
  if (minDist <= dist) continue;
  minDist = dist;
  minIdx = i;
}

console.log(minIdx + 1);
