const m = 10n**100n;

const sqrt = (x) => {
  let out = m;
  for (let i = 0; i < 50; i++) {
    out = (out + x * m / out) / 2n;
  }
  return out;
}

const triangle = [
  [0n, 0n],
  [m, 0n],
  [m / 2n, sqrt(3n * m) / 2n]
];

let cur = [m / 2n, triangle[2][1] / 2n];
function iterate() {
  const a = cur;
  const b = triangle[Math.floor(Math.random() * 3)];
  cur = [(a[0] + b[0]) / 2n, (a[1] + b[1]) / 2n];
}
for (let i = 0; i < 700000; i++) iterate();

const points = [];
for (let i = 0; i < 100000; i++) {
  iterate();
  points.push(cur);
}

const iterateCount = 300000;
let sum = 0n;
for (let i = 0; i < iterateCount; i++) {
  const a = points[Math.floor(Math.random() * points.length)];
  const b = points[Math.floor(Math.random() * points.length)];
  sum += sqrt((a[0] - b[0]) ** 2n / m + (a[1] - b[1]) ** 2n / m);
}
console.log(Number(sum / BigInt(iterateCount)) / Number(m));
