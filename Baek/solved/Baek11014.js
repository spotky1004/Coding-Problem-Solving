const isWeb = typeof window === "object";
const isDev = isWeb || require("fs").existsSync("C:/users/spotky1004");

if (!isDev) {
  const input = require("fs").readFileSync("/dev/stdin").toString();
  const out = solve(input);
  console.log(out);
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
check(`4
2 3
...
...
2 3
x.x
xxx
2 3
x.x
x.x
10 10
....x.....
..........
..........
..x.......
..........
x...x.x...
.........x
...x......
........x.
.x...x....`,
`4
1
2
46`);
check(`2
1 1
.
6 4
x.x.
x...
x.x.
.x.x
...x
xx.x`,
`1
9`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const lines = input
  .trim()
  .split("\n");

// code
/**
 * @param {number} leftCount 
 * @param {number} rightCount 
 * @param {number[][]} connections 
 * @returns {number} 
*/
function bipartiteMatching(leftCount, rightCount, connections) {
  const occuipedBy = Array(rightCount).fill(-1);

  let done = Array(rightCount).fill(false);
  function match(idx) {
    for (const r of connections[idx]) {
      if (done[r]) continue;
      done[r] = true;

      if (occuipedBy[r] === -1 || match(occuipedBy[r])) {
        occuipedBy[r] = idx;
        return true;
      }
    }
    return false;
  }

  for (let i = 0; i < leftCount; i++) {
    done = Array(rightCount).fill(false);
    match(i);
  }
  return occuipedBy.filter(v => v !== -1).length;
}

/**
 * @param {number} x 
 * @param {number} y 
 * @param {number} w 
 * @param {number} h 
*/
function checkOOB(x, y, w, h) {
  if (
    0 > x || x >= w ||
    0 > y || y >= h
  ) return true;
  return false;
}



/**
 * @param {number} x 
 * @param {number} y 
 * @param {number} M 
 * @param {number} N 
 * @returns {number} 
 */
function coordToNode(x, y, M, N) {
  return y + N * Math.floor(x / 2);
}

const out = [];
let line = 1;
while (line < lines.length) {
  const [M, N] = lines[line++].split(" ").map(Number);
  const board = lines.slice(line, line + M)
    .map(row => Array.from(row).map(cell => cell === "."));
  line += M;

  const lNodeCount = M * Math.ceil(N / 2);
  const rNodeCount = M * Math.floor(N / 2);
  const connections = Array.from({ length: lNodeCount }, _ => []);

  const invaildPoses = [
    [-1, -1], [1, -1],
    [-1, 0], [1, 0],
    [-1, 1], [1, 1]
  ];

  for (let y = 0; y < M; y++) {
    for (let x = 0; x < N; x += 2) {
      if (!board[y][x]) continue;
      for (const [dx, dy] of invaildPoses) {
        const [xp, yp] = [x + dx, y + dy];
        if (
          checkOOB(xp, yp, N, M) ||
          !board[yp][xp]
        ) continue;
        connections[coordToNode(x, y, N, M)].push(coordToNode(xp, yp, N, M));
      }
    }
  }

  out.push(board.flat().reduce((a, b) => a + b, 0) - bipartiteMatching(lNodeCount, rNodeCount, connections));
}

// output
return out.join("\n");
}
