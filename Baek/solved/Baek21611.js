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
check(`7 1
0 0 0 0 0 0 0
3 2 1 3 2 3 0
2 1 2 1 2 1 0
2 1 1 0 2 1 1
3 3 2 3 2 1 2
3 3 3 1 3 3 2
2 3 2 2 3 2 3
2 2`,
`28`);
check(`7 4
0 0 0 2 3 2 3
1 2 3 1 2 3 1
2 3 1 2 3 1 2
1 2 3 0 2 3 1
2 3 1 2 3 1 2
3 1 2 3 1 2 3
1 2 3 1 2 3 1
1 3
2 2
3 1
4 3`,
`0`);
check(`7 4
1 1 1 2 2 2 3
1 2 2 1 2 2 3
1 3 3 2 3 1 2
1 2 2 0 3 2 2
3 1 2 2 3 2 2
3 1 2 1 1 2 1
3 1 2 2 2 1 1
1 3
2 2
3 1
4 3`,
`39`);
check(`7 7
1 1 1 2 2 2 3
1 2 2 1 2 2 3
1 3 3 2 3 1 2
1 2 2 0 3 2 2
3 1 2 2 3 2 2
3 1 2 1 1 2 1
3 1 2 2 2 1 1
1 3
2 2
3 1
4 3
1 3
1 1
1 3`,
`62`);
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
const spells = board.splice(N);

// code
const center = (N - 1) / 2;
const order = Array.from({ length: N }, () => Array(N).fill(-1));
order[center - 1][center - 1] = 7, order[center - 1][center    ] = 6, order[center - 1][center + 1] = 5;
order[center    ][center - 1] = 0,                                    order[center    ][center + 1] = 4;
order[center + 1][center - 1] = 1, order[center + 1][center    ] = 2, order[center + 1][center + 1] = 3;
let nextOrder = 8;
for (let i = 2; i <= center; i++) {
  const s = center - i, e = s + 2 * i;
  for (let j = s + 1; j <= e; j++) order[j][s] = nextOrder++;
  for (let j = s + 1; j <= e; j++) order[e][j] = nextOrder++;
  for (let j = e - 1; j >= s; j--) order[j][e] = nextOrder++;
  for (let j = e - 1; j >= s; j--) order[s][j] = nextOrder++;
}

const SPACE = N * N - 1;
const balls = Array(SPACE);
for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) if (order[i][j] !== -1) balls[order[i][j]] = board[i][j];

/**
 * @param {[di: number, si: number]} spell 
 */
function blizzard(spell) {
  const [di, si] = spell;
  const [iDelta, jDelta] = [[-1, 0], [1, 0], [0, -1], [0, 1]][di - 1];
  let cur = [center, center];
  for (let i = 0; i < si; i++) {
    cur[0] += iDelta, cur[1] += jDelta;
    balls[order[cur[0]][cur[1]]] = 0;
  }
}

function move() {
  let i = 0, j = 0;
  while (balls[i]) i++, j++;
  while (!balls[j] && j < SPACE) j++;

  let moved = false;
  while (j < SPACE) {
    moved = true;
    balls[i] = balls[j];
    balls[j] = 0;
    i++, j++;
    while (balls[i]) i++;
    while (!balls[j] && j < SPACE) j++;
  }
  return moved;
}

const boomCounter = [0, 0, 0, 0];
function boom() {
  for (let i = 0; i < SPACE; i++) {
    if (!balls[i]) continue;

    let sameCount = 1;
    for (let j = i + 1; j < SPACE; j++) {
      if (balls[i] !== balls[j]) break;
      sameCount++;
    }

    if (sameCount >= 4) {
      boomCounter[balls[i]] += sameCount;
      for (let j = 0; j < sameCount; j++) balls[i + j] = 0; 
    }
    i += sameCount - 1;
  }
}

function change() {
  const match = balls.join("").match(/1+|2+|3+/g);
  if (!match) return;
  const newBalls = match.map(v => [v.length, Number(v[0])]).flat();
  for (let i = 0; i < Math.min(SPACE, newBalls.length); i++) balls[i] = newBalls[i];
}

function print() {
  const out = Array.from({ length: N }, () => Array(N).fill(0));
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) if (order[i][j] !== -1) out[i][j] = balls[order[i][j]];
  return out;
}

for (const spell of spells) {
  blizzard(spell);
  // console.log("spell");
  // console.table(print());
  move();
  // console.log("move");
  // console.table(print());
  while (true) {
    boom();
    // console.log("boom");
    // console.table(print());
    const isMoved = move();
    // console.log("move");
    // console.table(print());
    if (!isMoved) break;
  }
  change();
  // console.log("change");
  // console.table(print());
}

// output
return boomCounter.reduce((a, b, i) => a + i * b, 0);
}
