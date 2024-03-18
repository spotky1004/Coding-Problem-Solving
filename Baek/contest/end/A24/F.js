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
check(`2 3
1 5 2
2 5 1`,
`0 2 1
1 2 0`);
check(`3 4
6 7 4 10
5 4 9 7
10 9 1 2`,
`2 3 0 3
1 0 3 2
2 1 0 1`);
check(`5 5
4 3 3 3 3
4 2 2 1 1
2 2 2 5 5
2 2 5 5 5
2 2 5 5 5`,
`3 2 2 2 2
3 1 1 0 0
1 1 1 2 2
1 1 2 2 2
1 1 2 2 2`);
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

// code
const rank = Array.from({ length : N * M + 1 }, _ => 1);
const roots = Array.from({ length: N * M + 1 }, (_, i) => i);

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



const dirs = [
  [1, 0], [-1, 0],
  [0, 1], [0, -1]
];
const posToIdx = (i, j) => M * i + j;

const positions = [];
for (let i = 0; i < N; i++) {
  for (let j = 0; j < M; j++) {
    positions.push([i, j]);
    const curIdx = posToIdx(i, j);
    for (const [di, dj] of dirs) {
      const [ti, tj] = [i + di, j + dj];
      if (
        0 > ti || ti >= N ||
        0 > tj || tj >= M ||
        board[i][j] !== board[ti][tj]
      ) continue;
      union(curIdx, posToIdx(ti, tj));
    }
  }
}
positions.sort(([ai, aj], [bi, bj]) => board[ai][aj] - board[bi][bj]);

const flatHeights = Array(N * M).fill(0);

for (const [i, j] of positions) {
  const curGaji = board[i][j];
  const curUnion = find(posToIdx(i, j));
  for (const [di, dj] of dirs) {
    const [ti, tj] = [i + di, j + dj];
    if (
      0 > ti || ti >= N ||
      0 > tj || tj >= M ||
      curGaji <= board[ti][tj]
    ) continue;
    const curHeight = flatHeights[curUnion];
    const newHeight = flatHeights[find(posToIdx(ti, tj))] + 1;
    if (curHeight < newHeight) {
      flatHeights[curUnion] = newHeight;
    }
  }
}

const heights = Array.from({ length: N }, () => Array(M).fill(0));
for (let i = 0; i < N; i++) {
  for (let j = 0; j < M; j++) {
    heights[i][j] = flatHeights[find(posToIdx(i, j))];
  }
}

// output
return heights.map(line => line.join(" ")).join("\n");
}
