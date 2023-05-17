const isDev = process?.platform !== "linux";
const [[N], ...poses] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`1
1 1
2 2
3 3
4 4`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

let minIdx = -1;
let minDist = Infinity;

for (let i = 0; i < poses.length; i++) {
  const [ax, ay] = poses[i];

  let farthestDist = -Infinity;
  for (let j = 0; j < poses.length; j++) {
    const [bx, by] = poses[j];
    const dist = Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);
    if (farthestDist < dist) {
      farthestDist = dist;
    }
  }

  if (minDist > farthestDist) {
    minIdx = i;
    minDist = farthestDist;
  }
}

console.log(poses[minIdx].join(" "));
