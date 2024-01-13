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
4 2 5 1 7
3 1 9 4 5
9 8 1 2 3
8 1 9 3 4
7 2 3 4 8
1 9 2 5 7
6 5 2 3 4
5 1 9 2 8
2 9 3 1 4`,
`54`);
check(`3
4 2 5 1 7
2 1 9 4 5
5 8 1 4 3
1 2 9 3 4
7 2 3 4 8
9 8 4 5 7
6 5 2 3 4
8 4 9 2 1
3 9 2 1 4`,
`1053`);

}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], ...students] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const dir = [
  [1, 0], [-1, 0],
  [0, 1], [0, -1]
];

const studentPoses = Array(N + 1).fill(null);
const board = Array.from({ length: N }, _ => Array(N).fill(0));
for (const [nr, ...likes] of students) {
  /** @type {[i: number, j : number, likeCount: number, emptyCount: number][]} */
  const scores = [];
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      if (board[i][j] !== 0) continue;

      let likeCount = 0;
      let emptyCount = 0;
      for (const [di, dj] of dir) {
        const [ti, tj] = [i + di, j + dj];
        if (
          0 > ti || ti >= N ||
          0 > tj || tj >= N
        ) continue;
        const cell = board[ti][tj];
        likeCount += likes.includes(cell);
        emptyCount += (cell === 0);
      }
      
      scores.push([i, j, likeCount, emptyCount]);
    }
  }

  scores.sort((a, b) => (b[2] - a[2]) || (b[3] - a[3]) || (a[0] - b[0]) || (a[1] - b[1]));
  const [i, j] = scores[0];
  board[i][j] = nr;
  studentPoses[nr] = [i, j];
}

let score = 0;
for (const [nr, ...likes] of students) {
  let likeCount = 0;
  const [i, j] = studentPoses[nr];
  for (const [di, dj] of dir) {
    const [ti, tj] = [i + di, j + dj];
    if (
      0 > ti || ti >= N ||
      0 > tj || tj >= N
    ) continue;
    likeCount += likes.includes(board[ti][tj]);
  }
  score += [0, 1, 10, 100, 1000][likeCount];
}

// output
return score;
}
