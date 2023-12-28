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
    const startMemory = !isWeb ? process.memoryUsage().heapUsed / 1024 : 0;
    const out = solve(input).toString().trim();
    const timeDeltaStr = (new Date().getTime() - startTime).toString();
    const timeDeltaZeroStr = " "+"0".repeat(6 - timeDeltaStr.length);
    const memoryDelta = ((!isWeb ? process.memoryUsage().heapUsed / 1024 : 0) - startMemory).toFixed(0);
    const memoryDeltaZeroStr = " "+"0".repeat(8 - memoryDelta.length);
    if (
      typeof answer === "string" ?
        out === answer :
        answer.includes(out)
    ) console.log("\x1b[1m%s\x1b[42m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[0m", `${caseName}: `, ` AC `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB");
    else console.log("\x1b[1m%s\x1b[41m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[31m%s\x1b[0m", `${caseName}: `, ` WA `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB\n", out.slice(0, 10000));
  }

// cases
check(`3 1 1 1 1 1 1 1 1 1 4
1 2 3 4
5 6 7 8
9 10 11 12
4
1 1 1 1 1 1 1 1 1 1 1 2 3 1 1 1 1 1 1 1 1 1 4
67
30 1 1 1 1 1 1 1 1 1 1 1 1 2 1 1 1 1 1 1 1 1 4
77`,
`1 1 3 1 1 1 1 1 1 1 4
5 1 10 11
6 7 8 12
9 2 3 4`);
check(`1 2 1 6 1 1 1 1 1 1 4
2 5 6 1
3 2 1 8
5 1 4 7
7 3 7 8
4 1 8 9
2 5 6 6
1 2 7 1
1 6 8 3
5 3 1 9
9 2 5 5
4 8 3 2
9 1 6 5
1
45 1 1 1 1 1 1 1 1 1 1 1 1 2 1 6 1 1 1 1 1 1 4`,
`1 2 1 6 1 1 1 1 1 1 4
3 2 5 6
5 1 2 1
7 3 1 8
4 1 4 7
2 8 7 8
5 6 6 9
1 1 2 7
5 3 6 1
9 2 8 3
4 8 1 9
9 3 5 5
1 6 5 2`);
check(`2 1 1 1 1 1 1 1 1 1 1
1
2
10
67
77
86
94
101
107
112
116
119
121`,
`1 1 1 1 1 1 1 1 1 1 2
1 2`);
check(`5 1 1 1 1 1 1 1 1 1 5
1 2 3 4 5
6 7 8 9 10
11 12 13 14 15
16 17 18 19 20
21 22 23 24 25
1
1 3 1 1 1 1 1 1 1 1 1 3 5 1 1 1 1 1 1 1 1 1 5
`,
`5 1 1 1 1 1 1 1 1 1 5
1 2 3 4 5
6 7 8 9 10
11 12 23 24 25
16 17 18 19 20
21 22 13 14 15`);
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
let line = 0;
const dims = lines[line++];

/**
 * @typedef {[m: number, n: number, o: number, p: number, q: number, r: number, s: number, t: number, u: number, v: number, w: number]} Point
 */

const arrInputLen = dims.slice(0, 10).reduce((a, b) => a * b, 1);
const flatArrItems = lines.slice(line, line + arrInputLen).flat().reverse();
line += arrInputLen;
/** @type {[value: number, pos: Point]} */
let items = [];
for (let m = 1; m <= dims[0]; m++) {
  for (let n = 1; n <= dims[1]; n++) {
    for (let o = 1; o <= dims[2]; o++) {
      for (let p = 1; p <= dims[3]; p++) {
        for (let q = 1; q <= dims[4]; q++) {
          for (let r = 1; r <= dims[5]; r++) {
            for (let s = 1; s <= dims[6]; s++) {
              for (let t = 1; t <= dims[7]; t++) {
                for (let u = 1; u <= dims[8]; u++) {
                  for (let v = 1; v <= dims[9]; v++) {
                    for (let w = 1; w <= dims[10]; w++) {
                      items.push([flatArrItems.pop(), [m, n, o, p, q, r, s, t, u, v, w]]);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

/**
 * type: 0 = reflect, 1 = move, 2 = dim swap
 * @type {[type: 0 | 1 | 2, affectDim1: number, affectDim2: number][]}
 */
const opDatas = [];
opDatas.push(null);
for (let i = 0; i < 11; i++) {
  opDatas.push([0, i]);
}
for (let i = 0; i < 11; i++) {
  for (let j = i + 1; j < 11; j++) {
    opDatas.push([1, i, j]);
  }
}
for (let i = 0; i < 11; i++) {
  for (let j = i + 1; j < 11; j++) {
    opDatas.push([2, i, j]);
  }
}

const dimSwaps = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const dimSwapsInv = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function swapPoint(p) {
  const newPoint = Array(11).fill(null);
  for (let i =  0; i < 11; i++) {
    newPoint[i] = p[dimSwaps[i]];
  }
  return newPoint;
}
/**
 * @param {Point} p 
 * @param {Point} a 
 * @param {Point} b 
 */
function isPointInSpace(p, a, b) {
  for (let i = 0; i < 11; i++) {
    const v = p[i];
    if (a[i] > v || v > b[i]) return false;
  }
  return true;
}

const [Q] = lines[line++];
for (let i = 0; i < Q; i++) {
  const [op, ...params] = lines[line++];
  const [type, affectDim1, affectDim2] = opDatas[op];
  if (type === 0) {
    const reflectDim = dimSwapsInv[affectDim1];
    const a = swapPoint(params.slice(0, 11));
    const b = swapPoint(params.slice(11));
    const s = a[reflectDim];
    const e = b[reflectDim];
    const len = e - s + 1;
    for (const [, p] of items) {
      if (!isPointInSpace(p, a, b)) continue;
      p[reflectDim] = len - (p[reflectDim] - s) - 1 + s;
    }
  } else if (type === 1) {
    const rDim = dimSwapsInv[affectDim1];
    const dDim = dimSwapsInv[affectDim2];
    const a = swapPoint(params.slice(0, 11));
    const b = swapPoint(params.slice(11));
    const x1 = a[rDim];
    const y1 = a[dDim];
    const x2 = b[rDim];
    const y2 = b[dDim];
    const w = x2 - x1 + 1;
    const h = y2 - y1 + 1;
    for (const [, p] of items) {
      if (!isPointInSpace(p, a, b)) continue;
      const x = p[rDim];
      const y = p[dDim];
      const xp = x - x1;
      const yp = y - y1;

      const l = Math.min(xp, yp, w - xp - 1, h - yp - 1);
      const x1p = x1 + l;
      const y1p = y1 + l;
      const x2p = x2 - l;
      const y2p = y2 - l;
      
      if (x === x1p && y !== y2p) p[dDim]++;
      if (y === y2p && x !== x2p) p[rDim]++;
      if (x === x2p && y !== y1p) p[dDim]--;
      if (y === y1p && x !== x1p) p[rDim]--;
    }
  } else if (type === 2) {
    const dim1Idx = dimSwapsInv[affectDim1];
    const dim2Idx = dimSwapsInv[affectDim2];
    const dim1 = dimSwaps[dim1Idx];
    const dim2 = dimSwaps[dim2Idx];
    dimSwaps[dim1Idx] = dim2;
    dimSwaps[dim2Idx] = dim1;
    dimSwapsInv[affectDim2] = dim1Idx;
    dimSwapsInv[affectDim1] = dim2Idx;
  }
}

function fixPoint(p) {
  const newP = Array(11).fill(null);
  for (let i = 10; i >= 0; i--) {
    newP[dimSwaps[i]] = p[i];
  }
  return newP;
}
function comparePoint(a, b) {
  for (let i = 0; i < 11; i++) {
    if (a[i] === b[i]) continue;
    if (a[i] > b[i]) return 1;
    return -1;
  }
  return 0;
}

items = items
  .map(item => [item[0], fixPoint(item[1])])
  .sort((a, b) => comparePoint(a[1], b[1]));

// console.log(items.map(v => v[1].join(" ")).join("\n"));

const out = [];
let row = [];
const dimSizes = Array(11).fill(-1);
let prevW = -1;
for (const [value, point] of items) {
  const w = point[10];
  for (let i = 0; i < 11; i++) {
    dimSizes[i] = Math.max(dimSizes[i], point[i]);
  }
  if (w <= prevW) {
    out.push(row.join(" "));
    row = [];
  }
  prevW = w;
  row.push(value);
}
if (row.length > 0) out.push(row.join(" "));

// output
return dimSizes.join(" ") + "\n" + out.join("\n");
}
