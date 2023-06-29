const isDev = process?.platform !== "linux";
const [skills] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`6 7 7 8 9 10 11 13`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

function ccw(x1, y1, x2, y2, x3, y3) {
  const r1 = (Math.atan2(x1 - x2, y1 - y2) + Math.PI * 2) % (Math.PI * 2);
  const r2 = (Math.atan2(x3 - x2, y3 - y2) + Math.PI * 2) % (Math.PI * 2);
  const diff = (r1 - r2 + Math.PI * 2) % (Math.PI * 2);

  if (Math.abs(diff - Math.PI) <= 0.00001 || Math.abs(diff) <= 0.00001) return 0;
  if (diff < Math.PI) return -1;
  return 1;
}



let count = 0;
function search(order = [], left = 2**8-1) {
  if (left !== 0) {
    for (let i = 0; i < 8; i++) {
      const mask = 1 << i;
      if ((left & mask) === 0) continue;
      search([...order, i], left ^ mask);
    }
  } else {
    const points = [];
    for (let i = 0; i < 8; i++) {
      const len = skills[order[i]];
      const dx = Math.sin(Math.PI * 2 * i / 8);
      const dy = Math.cos(Math.PI * 2 * i / 8);
      points.push([len * dx, len * dy]);
    }
    points.push(points[0]);
    points.push(points[1]);
    for (let i = 0; i < points.length - 2; i++) {
      if (ccw(
        ...points[i],
        ...points[i + 1],
        ...points[i + 2]
      ) === 1) return;
    }
    count++;
  }
}
search();

console.log(count);
