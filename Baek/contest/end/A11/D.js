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
check(`5 5
2 1
2 6 7 8 8
2 3 3 7 9
4 5 2 6 5
3 2 1 3 4
5 7 9 8 1
2
2 2
5 5`,
`9`);
check(`5 5
2 2
2 6 7 8 8
2 3 3 7 9
4 5 2 6 5
3 2 1 3 4
5 7 9 8 1
2
2 2
5 5`,
`4`);
check(`5 5
3 2
2 6 7 8 8
2 3 3 7 9
4 5 2 6 5
3 2 1 3 4
5 7 9 8 1
2
2 2
5 5`,
`1`);
check(`5 5
1 1
2 6 7 8 8
2 3 3 7 9
4 5 2 6 5
3 2 1 3 4
5 7 9 8 1
2
2 2
5 5`,
`15`);
check(`5 5
1 2
2 6 7 8 8
2 3 3 7 9
4 5 2 6 5
3 2 1 3 4
5 7 9 8 1
2
2 2
5 5`,
`9`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, M], [h, w], ...lines] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));
const board = lines.splice(0, N);
const [K] = lines.shift();
const holes = lines;

// code
/**
 * @param {number} x 
 * @param {number} y 
*/
function checkOOB(x, y) {
  if (
    0 > x || x >= M ||
    0 > y || y >= N
  ) return true;
  return false;
}



const canStep = Array.from({ length: N }, _ => Array(M).fill(false));
const visited = Array.from({ length: N }, _ => Array(M).fill(false));

const directions = [
  [1, 0], [-1, 0],
  [0, 1], [0, -1]
];

const queue = [...holes.map(([y, x]) => [x - 1, y - 1])];
for (const [x, y] of queue) {
  visited[y][x] = true;
  canStep[y][x] = true;
  const curH = board[y][x];
  for (const [dx, dy] of directions) {
    const [nx, ny] = [x + dx, y + dy];
    if (
      checkOOB(nx, ny) ||
      visited[ny][nx] ||
      curH > board[ny][nx]
    ) continue;

    visited[ny][nx] = true;
    queue.push([nx, ny]);
  }
}

const maxHeights = [];
for (let y = 0; y < N; y++) {
  const row = [];
  maxHeights.push(row);

  for (let x = 0; x < M; x++) {
    if (!canStep[y][x]) {
      row.push(0);
      continue;
    }

    row.push(1);
    if (y !== 0) row[x] += maxHeights[y - 1][x];
  }
}

let count = 0;
for (let y = 0; y < N; y++) {
  let canStepCount = 0;
  for (let x = 0; x < M; x++) {
    if (maxHeights[y][x] < h) {
      canStepCount = 0;
      continue;
    }

    canStepCount++;
    if (canStepCount >= w) count++;
  }
}

// output
return count;
}
