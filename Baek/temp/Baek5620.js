const isWeb = typeof window === "object";
const isDev = isWeb || require("fs").existsSync("C:/users/spotky");

if (!isDev) {
  const input = require("fs").readFileSync("/dev/stdin").toString();
  const out = solve(input);
  console.log(out);
} else {
  let CASE_NR = 1;
  function check(input, answer, caseName=`Case ${CASE_NR}`) {
    CASE_NR++;
    const startTime = new Date().getTime();
    const startMemory = !isWeb ? process.memoryUsage().heapUsed / 1024 : 0;
    const out = solve(input);
    const timeDeltaStr = (new Date().getTime() - startTime).toString();
    const timeDeltaZeroStr = " "+"0".repeat(6 - timeDeltaStr.length);
    const memoryDelta = ((!isWeb ? process.memoryUsage().heapUsed / 1024 : 0) - startMemory).toFixed(0);
    const memoryDeltaZeroStr = " "+"0".repeat(8 - memoryDelta.length);
    if (
      typeof answer === "string" ?
        out.toString() === answer :
        answer.includes(out)
    ) console.log("\x1b[1m%s\x1b[42m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[0m", `${caseName}: `, ` AC `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB");
    else console.log("\x1b[1m%s\x1b[41m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[31m%s\x1b[0m", `${caseName}: `, ` WA `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB\n", out);
  }

// cases
check(`3
5 5
0 0
-3 -4`,
`25`);
check(`2
0 0
1 1`,
`2`);
let case3 = "100000\n";
for (let i = 0; i < 100000; i++) {
  case3 += `${i % 10000} ${Math.floor(i / 10000)}\n`;
}
check(case3, `1`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[n], ...dots] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
/**
 * @param {[x: number, y: number][]} points 
*/
function convexHull(points) {
  function getRad(x1, y1, x2, y2) {
    return (Math.atan2(y2 - y1, x2 - x1) + 2*Math.PI) % (2*Math.PI);
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
      const rad1 = Math.atan2(xp2, yp2, x, y);
      const rad2 = (rad1 - Math.atan2(xp2, yp2, xp1, yp1) + 2*Math.PI) % (2*Math.PI);
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
const rangeFields = Array.from({ length: sqrtW }, _ => Array.from({ length: sqrtW }, _ => new Set()));
for (const [x, y] of dots) {
  const [xRange, yRange] = [
    Math.floor((x + offset) / sqrtW),
    Math.floor((y + offset) / sqrtW)
  ];
  rangeExits[yRange][xRange] = true;
  const pointStr = `${x} ${y}`;
  if (rangeFields[yRange][xRange].has(pointStr)) return 0;
  rangeFields[yRange][xRange].add(`${x} ${y}`);
}

let out = Infinity;
for (let x = 0; x < sqrtW; x++) {
  for (let y = 0; y < sqrtW; y++) {
    if (rangeFields[y][x].size === 0) continue;
    rangeFields[y][x] = [...rangeFields[y][x]].map(v => v.split(" ").map(Number));
    const p = rangeFields[y][x];
    for (let i = 0; i < p.length; i++) {
      const [ax, ay] = p[i];
      for (let j = i + 1; j < p.length; j++) {
        const [bx, by] = p[j];
        const dx = ax - bx;
        const dy = ay - by;
        out = Math.min(out, dx * dx + dy * dy);
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

console.time("t");
for (const [x1, y1, x2, y2] of toCheck) {
  const a = rangeFields[y1][x1];
  const b = rangeFields[y2][x2];
  for (const [xa, ya] of a) {
    for (const [xb, yb] of b) {
      out = Math.min(out, (xa - xb)**2 + (ya - yb)**2);
    }
  }
}
console.timeEnd("t");

// output
return out;
}
