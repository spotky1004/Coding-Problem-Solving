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
check(`6 4
0100
1110
1000
0000
0111
0000`,
`15`);
check(`4 4
0111
1111
1111
1110`,
`-1`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const lines = input
  .trim()
  .split("\n");
const [N, M] = lines.shift().split(" ").map(Number);
const board = lines.map(row => Array.from(row).map(Number));

// code
function isOOB(i, j) {
  if (
    0 > i || i >= N ||
    0 > j || j >= M
  ) return true;
  return false;
}

const dir = [[1, 0], [-1, 0], [0, 1], [0, -1]];
function searchFrom(si, sj) {
  const dist = Array.from({ length: N }, _ => Array(M).fill(-1));
  dist[si][sj] = 1;
  const queue = [[si, sj]];
  for (const [i, j] of queue) {
    for (const [di, dj] of dir) {
      const [ti, tj] = [i + di, j + dj];
      if (
        isOOB(ti, tj) ||
        board[ti][tj] === 1 ||
        dist[ti][tj] !== -1
      ) continue;
      dist[ti][tj] = dist[i][j] + 1;
      queue.push([ti, tj]);
    }
  }

  return dist;
}

const startDist = searchFrom(0, 0);
const endDist = searchFrom(N - 1, M - 1);

let minDist = Infinity;
if (startDist[N - 1][M - 1] !== -1) minDist = startDist[N - 1][M - 1];

for (let i = 0; i < N; i++) {
  for (let j = 0; j < M; j++) {
    if (board[i][j] === 0) continue;
    for (const [di1, dj1] of dir) {
      const [ti1, tj1] = [i + di1, j + dj1];
      if (
        isOOB(ti1, tj1) ||
        startDist[ti1][tj1] === -1
      ) continue;
      const dist1 = startDist[ti1][tj1];
      for (const [di2, dj2] of dir) {
        const [ti2, tj2] = [i + di2, j + dj2];
        if (
          (di1 === di2 && dj1 === dj2) ||
          isOOB(ti2, tj2) ||
          endDist[ti2][tj2] === -1
        ) continue;
        const dist2 = endDist[ti2][tj2];
        minDist = Math.min(minDist, dist1 + dist2 + 1);
      }
    }
  }
}

// output
return isFinite(minDist) ? minDist : -1;
}
