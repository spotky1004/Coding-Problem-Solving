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
check(`10 2
.L
..
XX
XX
XX
XX
XX
XX
..
.L`,
`3`);
check(`4 11
..XXX...X..
.X.XXX...L.
....XXX..X.
X.L..XXX...`,
`2`);
check(`8 17
...XXXXXX..XX.XXX
....XXXXXXXXX.XXX
...XXXXXXXXXXXX..
..XXXXX.LXXXXXX..
.XXXXXX..XXXXXX..
XXXXXXX...XXXX...
..XXXXX...XXX....
....XXXXX.XXXL...`,
`2`);
check(`1 3
LXL`,
`1`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const lines = input
  .trim()
  .split("\n");
const [R, C] = lines.shift().split(" ").map(Number);
const board = lines.map(line => Array.from(line));

// code
const rank = Array.from({ length : R * C + 1 }, _ => 1);
const roots = Array.from({ length: R * C + 1 }, (_, i) => i);

/**
 * @param {number} a 
*/
function find(a) {
  if (roots[a] === a) return a;

  const root = find(roots[a]);
  roots[a] = root;
  return root;
}

/**
 * @param {number} a 
 * @param {number} b 
*/
function union(a, b){
  a = find(a);
  b = find(b);

  if (a === b) return;

  if (rank[a] < rank[b]) {
    roots[a] = b;
  } else {
    roots[b] = a;
    if (rank[a] === rank[b]) {
      rank[a]++;
    }
  }
}

const posToIdx = (r, c) => 1 + r * C + c;



const dirs = [
  [1, 0], [-1, 0],
  [0, 1], [0, -1]
];
const swarmIdxes = [];
let curQueue = [];
let nextQueue = [];
for (let r = 0; r < R; r++) {
  for (let c = 0; c < C; c++) {
    const cell = board[r][c];
    const idx = posToIdx(r, c);
    if (cell !== "X") {
      nextQueue.push([r, c]);
      for (const [dr, dc] of dirs) {
        const [pr, pc] = [r + dr, c + dc];
        if (
          0 > pr || pr >= R ||
          0 > pc || pc >= C ||
          board[pr][pc] === "X"
        ) continue;
        union(idx, posToIdx(pr, pc));
      }
    }
    if (cell === "L") {
      swarmIdxes.push(idx);
    }
  }
}

let day = 0;
while (find(swarmIdxes[0]) !== find(swarmIdxes[1])) {
  day++;
  curQueue = nextQueue;
  nextQueue = [];
  for (const [r, c] of curQueue) {
    const idx = posToIdx(r, c);
    for (const [dr, dc] of dirs) {
      const [pr, pc] = [r + dr, c + dc];
      if (
        0 > pr || pr >= R ||
        0 > pc || pc >= C ||
        board[pr][pc] !== "X"
      ) continue;
      board[pr][pc] = ".";
      nextQueue.push([pr, pc]);
      union(idx, posToIdx(pr, pc));
    }
  }
  for (const [r, c] of nextQueue) {
    const idx = posToIdx(r, c);
    for (const [dr, dc] of dirs) {
      const [pr, pc] = [r + dr, c + dc];
      if (
        0 > pr || pr >= R ||
        0 > pc || pc >= C ||
        board[pr][pc] === "X"
      ) continue;
      union(idx, posToIdx(pr, pc));
    }
  }
  // if (nextQueue.length !== 0) {
  //   console.log(day);
  //   console.table(board);
  //   console.table(board.map((row, r) => row.map((col, c) => find(posToIdx(r, c)))));
  // }
}

// output
return day;
}
