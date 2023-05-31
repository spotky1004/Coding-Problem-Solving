const isDev = process?.platform !== "linux";
const [[n], ...dots] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`6
-3821 -4487
2019 2348
-4831 -3672
-8109 2430
-5010 5437
-7107 -1987
`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

/**
 * @param {[x: number, y: number][]} points 
*/
function convexHull(points) {
  function getRad(x1, y1, x2, y2) {
    return Number(((Math.atan2(y2 - y1, x2 - x1) + 2*Math.PI) % (2*Math.PI)).toFixed(10));
  }
  
  const startPoint = points
    .map((v, i) => [i, v])
    .sort((a, b) => {
      const yComp = a[1][1] - b[1][1];
      if (yComp !== 0) return yComp;
      const xComp = a[1][0] - b[1][0];
      return xComp;
    })[0][0];
  const [x0, y0] = points[startPoint];
  const sortedIdx = points
    .map(([x, y], i) => [i, getRad(x, y, x0, y0), x])
    .sort((a, b) => {
      const diff = a[1] - b[1];
      if (diff !== 0) return diff;
      const inverted = Math.min(a[2], b[2]) < x0;
      const aIdx = a[0];
      const bIdx = b[0];
      const xDiff = (inverted ? -1 : 1) * (points[aIdx][0] - points[bIdx][0]);
      if (xDiff !== 0) return xDiff;
      const yDiff = (inverted ? -1 : 1) * (points[aIdx][1] - points[bIdx][1]);
      return yDiff;
    })
    .map(v => v[0]);
  
  const stack = [startPoint];
  if (sortedIdx.length >= 1) {
    const idx = sortedIdx[1];
    stack.push(idx);
  }
  
  for (let i = 2; i < sortedIdx.length; i++) {
    const idx = sortedIdx[i];
    const [x, y] = points[idx];
    while (stack.length >= 2) {
      const prev1 = stack[stack.length - 1];
      const prev2 = stack[stack.length - 2];
      const [xp1, yp1] = points[prev1];
      const [xp2, yp2] = points[prev2];
      const rad1 = getRad(xp2, yp2, x, y);
      const rad2 = (rad1 - getRad(xp2, yp2, xp1, yp1) + 2*Math.PI) % (2*Math.PI);
      if (rad2 === 0 || rad2 >= Math.PI) {
        stack.pop();
      } else {
        break;
      }
    }
    stack.push(idx);
  }
  const idx = sortedIdx[0];
  const [x, y] = points[idx];
  while (stack.length > 2) {
    const prev1 = stack[stack.length - 1];
    const prev2 = stack[stack.length - 2];
    const [xp1, yp1] = points[prev1];
    const [xp2, yp2] = points[prev2];
    const rad1 = getRad(xp2, yp2, x, y);
    const rad2 = (rad1 - getRad(xp2, yp2, xp1, yp1) + 2*Math.PI) % (2*Math.PI);
    if (rad2 === 0 || rad2 >= Math.PI) {
      stack.pop();
    } else {
      break;
    }
  }

  const convexPoints = [];
  let j = 0;
  for (let i = 0; i < points.length; i++) {
    if (stack[j] > i) continue;
    convexPoints.push(points[i]);
    j++;
  }

  return points;
}



const offset = 10000;
const w = 20001;

const sqrtW = Math.ceil(Math.sqrt(w));
const rangeExits = Array.from({ length: sqrtW }, _ => Array(sqrtW).fill(false));
const rangeFields = Array.from({ length: sqrtW }, _ => Array.from({ length: sqrtW }, _ => []));
for (const [x, y] of dots) {
  const [xRange, yRange] = [
    Math.floor((x + offset) / sqrtW),
    Math.floor((y + offset) / sqrtW)
  ];
  rangeExits[yRange][xRange] = true;
  rangeFields[yRange][xRange].push([x, y]);
}

let out = Infinity;
for (let x = 0; x < sqrtW; x++) {
  for (let y = 0; y < sqrtW; y++) {
    if (rangeFields[y][x].length === 0) continue;
    const prevLen = rangeFields[y][x].length;
    rangeFields[y][x] = [...new Set(rangeFields[y][x].map(([x, y]) => `${x} ${y}`))].map(v => v.split(" ").map(Number));
    if (prevLen !== rangeFields[y][x].length) {
      console.log(0);
      process.exit(0);
    }
    const p = rangeFields[y][x];
    for (const [ax, ay] of p) {
      for (const [bx, by] of p) {
        if (ax == bx && ay == by) continue;
        out = Math.min(out, (ax - bx)**2 + (ay - by)**2);
      }
    }
    rangeFields[y][x] = convexHull(rangeFields[y][x]);
  }
}

let minDist = Infinity;
let toCheck = [];
for (let x1 = 0; x1 < sqrtW; x1++) {
  for (let y1 = 0; y1 < sqrtW; y1++) {
    const isExist1 = rangeExits[y1][x1];
    for (let x2 = 0; x2 < sqrtW; x2++) {
      for (let y2 = 0; y2 < sqrtW; y2++) {
        if (x1 >= x2 && y1 >= y2) continue;
        const isExist2 = rangeExits[y2][x2];
        if (!isExist1 || !isExist2) continue;
        const dist = Math.max(x2 - x1)**2 + Math.max(y2 - y1)**2;
        if (minDist < dist) continue;
        if (minDist !== dist) {
          minDist = dist;
          toCheck = [];
        }
        toCheck.push([x1, y1, x2, y2]);
      }
    }
  }
}

for (const [x1, y1, x2, y2] of toCheck) {
  const a = rangeFields[y1][x1];
  const b = rangeFields[y2][x2];
  for (const [xa, ya] of a) {
    for (const [xb, yb] of b) {
      out = Math.min(out, (xa - xb)**2 + (ya - yb)**2);
    }
  }
}

console.log(out);
