const isDev = process?.platform !== "linux";
let [[n], [a, b, c, d]] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`4
1 3 2 4`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

if (a > b) [a, b] = [b, a];
if (c > d) [c, d] = [d, c];
if (a < c) [a, b, c, d] = [c, d, a, b];
console.log(a, b, c, d)
let circle = [];
let line = [];

for (let i = d; i <= b - 1; i++) {
  line.push(i);
}
for (let i = 1; i <= n; i++) {
  if (line.includes(i)) continue;
  circle.push(i);
}
while (circle[0] !== c) {
  circle.push(circle.shift());
}
console.log(circle, line);

const poses = Array(n);
for (let i = 0; i < circle.length; i++) {
  const idx = circle[i] - 1;
  const x = Math.floor(Math.sin(2*Math.PI / circle.length * i) * 1e9);
  const y = Math.floor(Math.cos(2*Math.PI / circle.length * i) * 1e9);
  poses[idx] = `${x} ${y}`;
}

for (let i = 0; i < line.length; i++) {
  const idx = line[i] - 1;
  const x = 0;
  const y = 1e9 - 100 * (i + 1);
  poses[idx] = `${x} ${y}`;
}

console.log(poses.join("\n"));
