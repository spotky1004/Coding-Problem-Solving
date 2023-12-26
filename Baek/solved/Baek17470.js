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
check(`4 4 1
1 2 3 4
5 6 7 8
9 10 11 12
13 14 15 16
1`,
`13 14 15 16
9 10 11 12
5 6 7 8
1 2 3 4`);
check(`6 8 1
3 2 6 3 1 2 9 7
9 7 8 2 1 4 5 3
5 9 2 1 9 6 1 8
2 1 3 8 6 3 9 2
1 3 2 8 7 9 2 1
4 5 1 9 8 2 1 3
1`,
`4 5 1 9 8 2 1 3
1 3 2 8 7 9 2 1
2 1 3 8 6 3 9 2
5 9 2 1 9 6 1 8
9 7 8 2 1 4 5 3
3 2 6 3 1 2 9 7`);
check(`6 8 1
3 2 6 3 1 2 9 7
9 7 8 2 1 4 5 3
5 9 2 1 9 6 1 8
2 1 3 8 6 3 9 2
1 3 2 8 7 9 2 1
4 5 1 9 8 2 1 3
2`,
`7 9 2 1 3 6 2 3
3 5 4 1 2 8 7 9
8 1 6 9 1 2 9 5
2 9 3 6 8 3 1 2
1 2 9 7 8 2 3 1
3 1 2 8 9 1 5 4`);
check(`6 8 1
3 2 6 3 1 2 9 7
9 7 8 2 1 4 5 3
5 9 2 1 9 6 1 8
2 1 3 8 6 3 9 2
1 3 2 8 7 9 2 1
4 5 1 9 8 2 1 3
3`,
`4 1 2 5 9 3
5 3 1 9 7 2
1 2 3 2 8 6
9 8 8 1 2 3
8 7 6 9 1 1
2 9 3 6 4 2
1 2 9 1 5 9
3 1 2 8 3 7`);
check(`6 8 1
3 2 6 3 1 2 9 7
9 7 8 2 1 4 5 3
5 9 2 1 9 6 1 8
2 1 3 8 6 3 9 2
1 3 2 8 7 9 2 1
4 5 1 9 8 2 1 3
4`,
`7 3 8 2 1 3
9 5 1 9 2 1
2 4 6 3 9 2
1 1 9 6 7 8
3 2 1 8 8 9
6 8 2 3 2 1
2 7 9 1 3 5
3 9 5 2 1 4`);
check(`6 8 1
3 2 6 3 1 2 9 7
9 7 8 2 1 4 5 3
5 9 2 1 9 6 1 8
2 1 3 8 6 3 9 2
1 3 2 8 7 9 2 1
4 5 1 9 8 2 1 3
5`,
`2 1 3 8 3 2 6 3
1 3 2 8 9 7 8 2
4 5 1 9 5 9 2 1
6 3 9 2 1 2 9 7
7 9 2 1 1 4 5 3
8 2 1 3 9 6 1 8`);
check(`6 8 1
3 2 6 3 1 2 9 7
9 7 8 2 1 4 5 3
5 9 2 1 9 6 1 8
2 1 3 8 6 3 9 2
1 3 2 8 7 9 2 1
4 5 1 9 8 2 1 3
6`,
`1 2 9 7 6 3 9 2
1 4 5 3 7 9 2 1
9 6 1 8 8 2 1 3
3 2 6 3 2 1 3 8
9 7 8 2 1 3 2 8
5 9 2 1 4 5 1 9`);
check(`6 8 6
3 2 6 3 1 2 9 7
9 7 8 2 1 4 5 3
5 9 2 1 9 6 1 8
2 1 3 8 6 3 9 2
1 3 2 8 7 9 2 1
4 5 1 9 8 2 1 3
1 2 3 4 5 6`,
`3 1 2 8 9 1 5 4
1 2 9 7 8 2 3 1
2 9 3 6 8 3 1 2
8 1 6 9 1 2 9 5
3 5 4 1 2 8 7 9
7 9 2 1 3 6 2 3`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
let [[N, M, R], ...arr] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));
const ops = arr.pop();

// code
function flipUd(arr) {
  const [w, h] = [arr[0].length, arr.length];
  const half = Math.ceil(h / 2);
  for (let i = half; i < h; i++) {
    for (let j = 0; j < w; j++) {
      const tmp = arr[i][j];
      arr[i][j] = arr[h - i - 1][j];
      arr[h - i - 1][j] = tmp;
    }
  }
  return arr;
}
function flipLr(arr) {
  const [w, h] = [arr[0].length, arr.length];
  const half = Math.ceil(w / 2);
  for (let i = 0; i < h; i++) {
    for (let j = half; j < w; j++) {
      const tmp = arr[i][j];
      arr[i][j] = arr[i][w - j - 1];
      arr[i][w - j - 1] = tmp;
    }
  }
  return arr;
}
function rotateR(arr) {
  const [w, h] = [arr[0].length, arr.length];
  const newArr = [];
  for (let j = 0; j < w; j++) {
    const row = [];
    newArr.push(row);

    for (let i = h - 1; i >= 0; i--) {
      row.push(arr[i][j]);
    }
  }
  return newArr;
}
function rotateL(arr) {
  const [w, h] = [arr[0].length, arr.length];
  const newArr = [];
  for (let j = w - 1; j >= 0; j--) {
    const row = [];
    newArr.push(row);

    for (let i = 0; i < h; i++) {
      row.push(arr[i][j]);
    }
  }
  return newArr;
}

function split(arr) {
  const [w, h] = [M / 2, N / 2];
  const newArr = [[[], []], [[], []]];
  for (let i = 0; i < h; i++) {
    const row = [];
    newArr[0][0].push(row);
    for (let j = 0; j < w; j++) {
      row.push(arr[i][j]);
    }
  }
  for (let i = 0; i < h; i++) {
    const row = [];
    newArr[0][1].push(row);
    for (let j = w; j < M; j++) {
      row.push(arr[i][j]);
    }
  }
  for (let i = h; i < N; i++) {
    const row = [];
    newArr[1][0].push(row);
    for (let j = 0; j < w; j++) {
      row.push(arr[i][j]);
    }
  }
  for (let i = h; i < N; i++) {
    const row = [];
    newArr[1][1].push(row);
    for (let j = w; j < M; j++) {
      row.push(arr[i][j]);
    }
  }

  return newArr;
}
function unsplit(arr) {
  const [w, h] = [2 * arr[0][0][0].length, 2 * arr[0][0].length];
  const [halfW, halfH] = [w / 2, h / 2];
  const newArr = [];
  for (let i = 0; i < h; i++) {
    const row = [];
    newArr.push(row);
    for (let j = 0; j < w; j++) {
      row.push(arr[Math.floor(i / halfH)][Math.floor(j / halfW)][i % halfH][j % halfW]);
    }
  }
  return newArr;
}

function join2DArr(arr) {
  return arr.map(row => row.join(" ")).join("\n");
}

arr = split(arr);
let isFlippedUd = 0;
let isFlippedLr = 0;
let rotateCount = 0;
for (const op of ops) {
  if (op === 1) {
    arr = flipUd(arr);
    isFlippedUd ^= 1;
  }
  if (op === 2) {
    arr = flipLr(arr);
    isFlippedLr ^= 1;
  }
  if (op === 3) {
    arr = rotateR(arr);
    rotateCount = rotateCount + 1 + 2 * (isFlippedUd ^ isFlippedLr);
  }
  if (op === 4) {
    arr = rotateL(arr);
    rotateCount = rotateCount + 3 + 2 * (isFlippedUd ^ isFlippedLr);
  }
  if (op === 5) {
    arr = rotateR(arr);
  }
  if (op === 6) {
    arr = rotateL(arr);
  }
}
rotateCount %= 4;

for (let i = 0; i < rotateCount; i++) arr = arr.map(row => row.map(subArr => rotateR(subArr)));
if (isFlippedUd) arr = arr.map(row => row.map(subArr => flipUd(subArr)));
if (isFlippedLr) arr = arr.map(row => row.map(subArr => flipLr(subArr)));

// arr.map(row => row.map(subArr => console.log(join2DArr(subArr) + "\n")));
arr = unsplit(arr);

// output
return join2DArr(arr);
}
