const m = 10n**5n;
function bigSqrt(x) {
  let left = 0n, right = x;
  const xm = x * m;
  while (left < right) {
    const mid = (left + right) / 2n;
    const midPow = mid ** 2n;
    if (midPow > xm) right = mid - 1n;
    else if (midPow < xm) left = mid + 1n;
    else return mid;
  }
  return left;
}
console.log(bigSqrt(100n * m))



const defaultPoints = [
  [0n, 0n],
  [m, 0n],
  [m / 2n, bigSqrt(3n * m / 2n)]
];

const points = [...defaultPoints];
const maxDepth = 5;
let minTriangle = [...defaultPoints];
let minTriangleDepth = 0;
function getPoints(tri, depth = 0) {
  if (minTriangleDepth > depth) minTriangle = tri;
  // console.log(p.map(v => v.map(v => Number(v / 10n**250n) / 1e50)), depthLeft);
  if (depth > maxDepth) return;
  const [m1, m2, m3] = [
    [(tri[0][0] + tri[1][0]) / 2n, (tri[0][1] + tri[1][1]) / 2n],
    [(tri[1][0] + tri[2][0]) / 2n, (tri[1][1] + tri[2][1]) / 2n],
    [(tri[2][0] + tri[0][0]) / 2n, (tri[2][1] + tri[0][1]) / 2n]
  ];
  points.push(m1, m2, m3);
  getPoints([tri[0], m1, m3], depth + 1);
  getPoints([m1, tri[1], m2], depth + 1);
  getPoints([m3, m2, tri[2]], depth + 1);
}
getPoints(points);

let sum = 0n;
for (let i = 0; i < points.length; i++) {
  const [ax, ay] = points[i];
  for (let j = 0; j < points.length; j++) {
    const [bx, by] = points[j];
    sum += bigSqrt(((ax - bx)**2n + (ay - by)**2n) / m) / BigInt(points.length);
  }
}
console.log(Number(sum / BigInt(points.length)) / Number(m));
