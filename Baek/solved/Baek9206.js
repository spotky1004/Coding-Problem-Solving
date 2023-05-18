const isDev = process?.platform !== "linux";
const [[V, N], ...vases] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`25.0 2
1.0 2.0 2.0
2.0 1.0 2.0`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const volumes = [];
const dx = 0.000003;
for (const [a, b, h] of vases) {
  let volume = 0;
  for (let x = dx; x <= h; x += dx) {
    const r = a * Math.E**-(x**2) + b * Math.sqrt(x);
    const dv = r * r * Math.PI * dx;
    volume += dv;
  }

  volumes.push(volume);
}

let closestIdx = -1;
let closestDiff = Infinity;

for (let i = 0; i < volumes.length; i++) {
  const diff = Math.abs(V - volumes[i]);
  if (diff > closestDiff) continue;
  closestIdx = i;
  closestDiff = diff;
}

console.log(closestIdx);
