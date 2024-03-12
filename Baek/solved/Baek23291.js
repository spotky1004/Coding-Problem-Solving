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
check(`8 7
5 2 3 14 9 2 11 8`,
`1`);
check(`8 4
5 2 3 14 9 2 11 8`,
`2`);
check(`8 3
5 2 3 14 9 2 11 8`,
`3`);
check(`8 2
5 2 3 14 9 2 11 8`,
`4`);
check(`8 1
5 2 3 14 9 2 11 8`,
`5`);
check(`8 0
5 2 3 14 9 2 11 8`,
`6`);
check(`4 0
1 10000 1 10000`,
`10`);
check(`16 0
1 1 10000 1 2 3 10000 9999 10 9 8 10000 5 4 3 1`,
`13`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, K], initialBowls] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
function genFoldShape(n) {
  let shape1, shape2;

  const board = Array.from({ length: n }, () => Array(n).fill(-1));
  board[n - 2][1] = 0;
  for (let i = 1; i < n; i++) {
    board[n - 1][i] = i;
  }
  while (true) {
    let xs = 0;
    let w = 0, h = 0;
    for (let x = 0; x < n; x++) {
      if (board[n - 1][x] === -1) continue;
      xs = x;
      for (let y = n - 1; y >= 0; y--) {
        if (board[y][x] === -1) break;
        h++;
      }
      for (let xt = x; xt < n; xt++) {
        if (board[n - 2][xt] === -1) break;
        w++;
      }
      break;
    }

    const notStacked = n - w * h;
    if (h > notStacked) {
      shape1 = [];
      for (let y = h - 1; y >= 0; y--) {
        shape1.push(board[n - y - 1].slice(n - notStacked - w));
      }
      break;
    }
    for (let x = xs; x < xs + w; x++) {
      for (let y = 0; y < h; y++) {
        board[n - (1 + xs + w - x)][xs + w + y] = board[n - y - 1][x];
        board[n - y - 1][x] = -1;
      }
    }
  }

  shape2 = [[], [], [], []];
  const quarter = n / 4;
  for (let i = n - quarter - 1; i >= n - 2 * quarter; i--) {
    shape2[0].push(i);
  }
  for (let i = n - 3 * quarter; i < n - 2 * quarter; i++) {
    shape2[1].push(i);
  }
  for (let i = n - 3 * quarter - 1; i >= 0; i--) {
    shape2[2].push(i);
  }
  for (let i = n - 1 * quarter; i < n; i++) {
    shape2[3].push(i);
  }

  return [shape1, shape2];
}

function getMinMaxValue(bowls) {
  return bowls.reduce(([min, max], b) => [Math.min(min, b), Math.max(max, b)], [Infinity, -Infinity])
}

function applyShape(shape, bowls) {
  const h = shape.length;
  const w = shape[0].length;
  const board = Array.from({ length: h }, () => Array(w).fill(-1));
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (shape[y][x] === -1) continue;
      board[y][x] = bowls[shape[y][x]];
    }
  }
  return board;
}

function unfoldBoard(board) {
  const h = board.length;
  const w = board[0].length;
  const bowls = [];
  for (let x = 0; x < w; x++) {
    for (let y = h - 1; y >= 0; y--) {
      if (board[y][x] === -1) continue;
      bowls.push(board[y][x]);
    }
  }
  return bowls;
}

function adjustBowls(bowls) {
  const min = getMinMaxValue(bowls)[0];
  for (let i = 0; i < bowls.length; i++) {
    if (bowls[i] !== min) continue;
    bowls[i]++;
  }
  return bowls;
}

const dirs = [
  [1, 0], [-1, 0],
  [0, 1], [0, -1]
];
function adjustBoard(board) {
  const h = board.length;
  const w = board[0].length;
  const delta = Array.from({ length: h }, () => Array(w).fill(0));
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (board[y][x] === -1) continue;

      const a = board[y][x];
      for (const [dy, dx] of dirs) {
        const yt = y + dy;
        const xt = x + dx;
        if (
          0 > yt || yt >= h ||
          0 > xt || xt >= w ||
          board[yt][xt] === -1
        ) continue;

        const b = board[yt][xt];
        const d = Math.floor((a - b) / 5);
        if (d <= 0) continue;
        
        delta[y][x] -= d;
        delta[yt][xt] += d;
      }
    }
  }

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      board[y][x] += delta[y][x];
    }
  }

  return board;
}

const [shape1, shape2] = genFoldShape(N);
let bowls = initialBowls;
let step = 0;
while (true) {
  const [min, max] = getMinMaxValue(bowls);
  if (max - min <= K) break;
  // 귀찮아졌어요
  bowls = unfoldBoard(adjustBoard(applyShape(shape2, unfoldBoard(adjustBoard(applyShape(shape1, adjustBowls(bowls)))))));
  step++;
}

// output
return step;
}
