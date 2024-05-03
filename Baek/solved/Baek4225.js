const isWeb = typeof window === "object";
const isDev = isWeb || require("fs").existsSync("C:/users/spotky");

if (!isDev) {
  const input = require("fs").readFileSync("/dev/stdin").toString();
  const out = solve(input);
  if (!isWeb) {
    process.stdout.write(out.toString());
    process.exit(0);
  } else {
    console.log(out);
  }
} else {
  if (!isWeb) require('node:v8').setFlagsFromString('--stack-size=65536');

  let CASE_NR = 1;
  function check(input, answer, caseName=`Case ${CASE_NR}`) {
    CASE_NR++;
    const startTime = new Date().getTime();
    const startMemory = !isWeb ? process.memoryUsage().heapUsed : window.performance.memory.usedJSHeapSize;
    const out = solve(input).toString().trim();
    const timeDeltaStr = (new Date().getTime() - startTime).toString();
    const timeDeltaZeroStr = " "+"0".repeat(6 - timeDeltaStr.length);
    const memoryDelta = (((!isWeb ? process.memoryUsage().heapUsed : window.performance.memory.usedJSHeapSize) - startMemory) / 1024).toFixed(0);
    const memoryDeltaZeroStr = " "+"0".repeat(8 - memoryDelta.length);
    if (
      typeof answer === "string" ?
        out === answer :
        answer.includes(out)
    ) console.log("\x1b[1m%s\x1b[42m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[0m", `${caseName}: `, ` AC `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB");
    else console.log("\x1b[1m%s\x1b[41m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[31m%s\x1b[0m", `${caseName}: `, ` WA `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB\n", out.slice(0, 10000));
  }

// cases
check(`3
0 0
3 0
0 4
4
0 10
10 0
20 10
10 20
0`,
`Case 1: 2.40
Case 2: 14.15`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const lines = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
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

  /** @type {[x: number, y: number][]} */
  const convexPoints = [];
  for (const idx of stack) {
    convexPoints.push(points[idx]);
  }

  return convexPoints;
}



const out = [];
let line = 0;
let caseNr = 1;
while (line < lines.length) {
  const [n] = lines[line++];
  if (n === 0) break;
  const points = lines.slice(line, line + n);
  line += n;

  let minLen = Infinity;
  const convex = convexHull(points);
  for (let i = 0; i < convex.length; i++) {
    const a = convex[i];
    const b = convex[(i + 1) % convex.length];

    const slope = Math.atan2(b[1] - a[1], b[0] - a[0]);
    const rotates = [
      0,
      slope,
      -slope,
      slope + Math.PI / 4,
      slope + 2 * Math.PI / 4,
      slope + 3 * Math.PI / 4
    ];
    
    for (const rad of rotates) {
      let minX = Infinity;
      let maxX = -Infinity;
      for (const [x, y] of convex) {
        const xp = x * Math.cos(-rad) - y * Math.sin(-rad);
        minX = Math.min(minX, xp);
        maxX = Math.max(maxX, xp);
      }
      minLen = Math.min(minLen, maxX - minX);
    }
  }
  minLen -= 1e-10;

  out.push(`Case ${caseNr}: ${(Math.ceil(minLen * 100) / 100).toFixed(2)}`);
  caseNr++;
}

// output
return out.join("\n");
}
