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
check(`5 3
MSG
SGM
GMS
SMG
MGS`,
`5`);
check(`4 4
MMSM
GSGM
MGSG
MSMM`,
`2`);
check(`3 6
GSGSGS
SGSGSG
MMMMMM`,
`6`);
check(`5 5
SGMGS
MSGSM
SGMGS
GMMMG
SGMGS`,
`8`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [size, ...board] = input
  .trim()
  .split("\n")
const [N, M] = size.split(" ").map(Number);

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



const coordToIdx = (x, y) => x + y * M;
const connections = Array.from({ length: N * M }, _ => []);

function canConnect(x1, y1, x2, y2) {
  const [dx, dy] = [x2 - x1, y2 - y1];
  const x3 = x2 + dx;
  const y3 = y2 + dy;
  if (
    checkOOB(x1, y1) ||
    checkOOB(x2, y2) ||
    checkOOB(x3, y3) ||
    board[y3][x3] !== "M"
  ) return false;
  
  const types = [
    board[y1][x1],
    board[y2][x2],
    board[y3][x3],
  ].sort().join("");

  return types === "GMS";
}
function connect(x1, y1, x2, y2) {
  if (!canConnect(x1, y1, x2, y2)) return;
  
  const [lIdx, rIdx] = [[board[y1][x1], coordToIdx(x1, y1)], [board[y2][x2], coordToIdx(x2, y2)]]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(v => v[1]);
  
  if (!connections[lIdx].includes(rIdx)) {
    connections[lIdx].push(rIdx);
  }
}

const directions = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],          [1, 0],
  [-1, 1], [0, 1], [1, 1]
];

for (let y = 0; y < N; y++) {
  for (let x = 0; x < M; x++) {
    for (const [dx, dy] of directions) {
      connect(x, y, x + dx, y + dy);
    }
  }
}

const count = bipartiteMatching(N * M, N * M, connections);


// output
return count;
}
