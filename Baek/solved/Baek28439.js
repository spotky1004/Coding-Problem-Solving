const isDev = typeof window === "object" || require("fs").existsSync("C:/users/spotky");

if (!isDev) {
  const input = require("fs").readFileSync("/dev/stdin").toString();
  const out = solve(input);
  console.log(out);
} else {
  let CASE_NR = 0;
  function check(input, answer) {
    CASE_NR++;
    const startTime = new Date().getTime();
    const startMemory = process.memoryUsage().heapUsed / 1024;
    const out = solve(input);
    const timeDeltaStr = (new Date().getTime() - startTime).toString();
    const timeDeltaZeroStr = " "+"0".repeat(6 - timeDeltaStr.length);
    const memoryDelta = ((process.memoryUsage().heapUsed / 1024) - startMemory).toFixed(0);
    const memoryDeltaZeroStr = " "+"0".repeat(8 - memoryDelta.length);
    if (
      typeof answer === "string" ?
        (out.toString() === answer || out.toString().trim() === answer) :
        answer.includes(out)
    ) console.log("\x1b[1m%s\x1b[42m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[0m", `Case ${CASE_NR}: `, ` AC `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB");
    else console.log("\x1b[1m%s\x1b[41m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[31m%s\x1b[0m", `Case ${CASE_NR}: `, ` WA `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB\n", out);
  }

// cases
check(`2 3
0 1 -3
2 3 -1`,
`3
1 2 2
2 2 1
2 3 -3`);
check(`2 2
1 2
2 4`,
`-1`);
check(`2 3
6 3 6
4 1 4`,
`3
1 1 6
1 2 4
2 2 -3`);
check(`2 3
0 0 0
0 0 0`,
`0`);
check(`2 4
0 0 3 3
-3 -3 0 0`,
[`3
1 1 3
2 1 -3
2 2 -3`,
`3
1 2 -3
2 3 3
2 4 3`]);
check(`2 9
2 2 3 4 4 4 4 4 4
0 0 1 2 2 2 2 2 2`,
`5
1 1 4
1 2 2
2 1 -2
2 2 -2
2 3 -1`);
}

function solve(input) {
// input
const [[N, M], ...mat] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const diff = mat[0].map((v, i, a) => v - (a[i - 1] ?? 0));
for (let i = 0; i < N; i++) {
  for (let j = 1; j < M; j++) {
    if (mat[i][j] - mat[i][j - 1] !== diff[j]) return -1;
  }
}

let rowMaxSameNumbers = [];
let rowMaxSameNumberCount = 0;
let colMaxSameNumbers = [];
let colMaxSameNumberCount = 0;

const zeroRow = mat[0].map(v => v - mat[0][0]).sort((a, b) => a - b);
let sameCount = 0;
let prev = -1;
for (let i = 0; i < M; i++) {
  if (prev !== zeroRow[i]) {
    sameCount = 0;
    prev = zeroRow[i];
  }
  sameCount++;

  if (sameCount > rowMaxSameNumberCount) {
    rowMaxSameNumbers = [];
    rowMaxSameNumberCount = sameCount;
  }
  if (sameCount >= rowMaxSameNumberCount) {
    rowMaxSameNumbers.push(prev);
  }
}

const zeroCol = Array.from({ length: N }, (_, i) => mat[i][0]).map(v => v - mat[0][0]).sort((a, b) => a - b);
sameCount = 0;
prev = -1;
for (let i = 0; i < N; i++) {
  if (prev !== zeroCol[i]) {
    sameCount = 0;
    prev = zeroCol[i];
  }
  sameCount++;

  if (sameCount > colMaxSameNumberCount) {
    colMaxSameNumbers = [];
    colMaxSameNumberCount = sameCount;
  }
  if (sameCount >= colMaxSameNumberCount) {
    colMaxSameNumbers.push(prev);
  }
}

let minCalc = [];
let minCalcLength = Infinity;

for (const rowAdd of rowMaxSameNumbers) {
  const calc = [];
  for (let i = 0; i < N; i++) {
    const toAdd = mat[i][0] + rowAdd;
    if (toAdd === 0) continue;
    calc.push(`1 ${i + 1} ${toAdd}`);
  }
  for (let j = 0; j < M; j++) {
    const toAdd = mat[0][j] - (mat[0][0] + rowAdd);
    if (toAdd === 0) continue;
    calc.push(`2 ${j + 1} ${toAdd}`);
  }

  if (minCalcLength > calc.length) {
    minCalc = calc;
    minCalcLength = calc.length
  }
}

for (const colAdd of colMaxSameNumbers) {
  const calc = [];
  for (let i = 0; i < N; i++) {
    const toAdd = mat[i][0] - (mat[0][0] + colAdd);
    if (toAdd === 0) continue;
    calc.push(`1 ${i + 1} ${toAdd}`);
  }
  for (let j = 0; j < M; j++) {
    const toAdd = mat[0][j] + colAdd;
    if (toAdd === 0) continue;
    calc.push(`2 ${j + 1} ${toAdd}`);
  }

  if (minCalcLength > calc.length) {
    minCalc = calc;
    minCalcLength = calc.length
  }
}

// output
return minCalc.length + "\n" + minCalc.join("\n");
}
