const isDev = process.platform !== "linux";
const points = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`5
1 1 Y
1 -1 Y
0 0 N
-1 -1 Y
-1 1 Y
`
)
  .trim()
  .split("\n")
  .map(line => {
    const splited = line.split(" ");
    if (splited[2] !== "Y") return null;
    return splited.slice(0, -1).map(Number);
  })
  .filter(v => v);

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
      const xComp = a[1][0] - b[1][0];
      if (xComp !== 0) return xComp;
      const yComp = a[1][1] - b[1][1];
      return yComp;
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
      if (rad2 > Math.PI) {
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

  return stack;
}

const convexPoints = convexHull(points).map(i => points[i].join(" "));
console.log(convexPoints.length + "\n" + convexPoints.join("\n"));
