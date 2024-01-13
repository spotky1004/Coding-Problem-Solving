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
check(`5 4
0 0 1 0 2
2 3 2 1 0
4 3 2 9 0
1 0 2 9 0
8 8 2 1 0
1 3
3 4
8 1
4 8`,
`77`);
check(`5 8
0 0 1 0 2
2 3 2 1 0
0 0 2 0 0
1 0 2 0 0
0 0 2 1 0
1 9
2 8
3 7
4 6
5 5
6 4
7 3
8 2`,
`41`);
check(`5 8
100 100 100 100 100
100 100 100 100 100
100 100 100 100 100
100 100 100 100 100
100 100 100 100 100
8 1
7 1
6 1
5 1
4 1
3 1
2 1
1 1`,
`2657`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, M], ...board] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));
const queries = board.splice(N, M);

// code
const clouds = Array.from({ length: N }, _ => Array(N).fill(false));
clouds[N - 2][0] = true;
clouds[N - 2][1] = true;
clouds[N - 1][0] = true;
clouds[N - 1][1] = true;

const dir = [
  [0, -1], [-1, -1],
  [-1, 0], [-1, 1],
  [0, 1], [1, 1],
  [1, 0], [1, -1]
];
const cloneDir = [
  [1, 1], [-1, 1],
  [1, -1], [-1, -1]
];

for (const [di, si] of queries) {
  const [dr, dc] = [dir[di - 1][0] * si, dir[di - 1][1] * si];

  const newCloudPoses = [];
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (!clouds[r][c]) continue;
      newCloudPoses.push([r + dr, c + dc].map(v => ((v % N) + N) % N));
      clouds[r][c] = false;
    }
  }

  for (const [r, c] of newCloudPoses) {
    clouds[r][c] = true;
    board[r][c]++;
  }
  for (const [r, c] of newCloudPoses) {
    for (const [dr, dc] of cloneDir) {
      const [tr, tc] = [r + dr, c + dc];
      if (
        0 > tr || tr >= N ||
        0 > tc || tc >= N ||
        board[tr][tc] === 0
      ) continue;
      board[r][c]++;
    }
  }

  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (clouds[r][c]) {
        clouds[r][c] = false;
      } else if (board[r][c] >= 2) {
        clouds[r][c] = true;
        board[r][c] -= 2;
      }
    }
  }
}

// output
return board.flat().reduce((a, b) => a + b, 0);
}
