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
check(`5 3 1
0 -1 0 0 0
-1 -1 0 1 1
0 0 0 1 1`,
`-1`);
check(`5 3 2
0 0 0 0 0
0 0 0 0 0
0 0 0 0 0
0 0 0 0 0
0 0 1 0 0
0 0 0 0 0`,
`4`);
check(`4 3 2
1 1 1 1
1 1 1 1
1 1 1 1
1 1 1 1
-1 -1 -1 -1
1 1 1 -1`,
`0`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[M, N, H], ...board] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const crate = Array.from({ length: H }, (_, i) => Array.from({ length: N }, (_, j) => Array.from({ length: M }, (_, k) => board[i * N + j][k])));
const moves = [
  [1, 0, 0], [-1, 0, 0],
  [0, 1, 0], [0, -1, 0],
  [0, 0, 1], [0, 0, -1]
];

let queue = [];
let nextQueue = [];
let time = -1;
let zeroCount = 0;

for (let i = 0; i < H; i++) {
  for (let j = 0; j < N; j++) {
    for (let k = 0; k < M; k++) {
      const value = crate[i][j][k];
      if (value === 0) zeroCount++;
      if (value === 1) nextQueue.push([i, j, k]);
    }
  }
}

while (nextQueue.length > 0) {
  queue = nextQueue;
  nextQueue = [];
  time++;

  for (const [i, j, k] of queue) {
    for (const [di, dj, dk] of moves) {
      const [ti, tj, tk] = [i + di, j + dj, k + dk];
      if (
        0 > ti || ti >= H ||
        0 > tj || tj >= N ||
        0 > tk || tk >= M ||
        crate[ti][tj][tk] !== 0
      ) continue;

      zeroCount--;
      crate[ti][tj][tk] = 1;
      nextQueue.push([ti, tj, tk]);
    }
  }
}

// output
return zeroCount === 0 ? time : -1;
}
