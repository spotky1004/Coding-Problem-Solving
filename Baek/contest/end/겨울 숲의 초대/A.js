const isDev = process.platform !== "linux";
let [[N], a] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`3
1 2 5`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

let t = 0;
while (a.length > 0) {
  a = a.sort((a, b) => b - a).filter(v => v > 0);
  const dt = Math.min(a[0], a[1] ?? Infinity);
  t += dt;
  a[0] -= dt;
  a[1] -= dt;
  a = a.filter(v => v > 0);
}

console.log(t > 1440 ? -1 : t);
