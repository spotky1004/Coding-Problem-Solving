const isDev = process?.platform !== "linux";
const [[N], ...poses] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`3
1 1
1 2
2 1`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

let sum = 0;
for (let i = 0; i < poses.length; i++) {
  const [ax, ay] = poses[i];
  for (let j = i + 1; j < poses.length; j++) {
    const [bx, by] = poses[j];
    sum += Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);
  }
}
console.log(sum / N * 2);
