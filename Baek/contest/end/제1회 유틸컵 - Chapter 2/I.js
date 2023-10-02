const isWeb = typeof window === "object";
const isDev = isWeb || require("fs").existsSync("C:/users/spotky");

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
check(`3 4 12
RGB
.@..
.##.
.##.
....
jJRRJjjDDjDJ`,
`....
.RB.
.BB.
...@`);
check(`7 5 17
UTILCUP
.@...
.#.#.
...#.
##.##
##...
JjjUUJRJLLJJjjjjJ`,
`@....
.U.U.
...#.
UU.##
U#...`);
check(`4 2 10
ABCD
@#
##
JJJJDJjjjJ`,
`@B
BB`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const _input = input
  .trim()
  .split("\n");
const [I, N, K] = _input.shift().split(" ").map(Number);
const inkTypes = _input.shift();
const board = _input.splice(0, N).map(row => Array.from(row));
const commands = Array.from(_input.shift());

// code
/**
 * @param {number} x 
 * @param {number} y 
*/
function checkOOB(x, y) {
  if (
    0 > x || x >= N ||
    0 > y || y >= N
  ) return true;
  return false;
}



// player
const p = { x: -1, y: -1 };
for (let y = 0; y < N; y++) {
  for (let x = 0; x < N; x++) {
    if (board[y][x] !== "@") continue;
    p.x = x;
    p.y = y;
  }
}

const moves = {
  "U": [0, -1], "D": [0, 1],
  "L": [-1, 0], "R": [1, 0]
};

let inkCount = 0;
let inkTypeIdx = 0;
for (const command of commands) {
  if (command === "j") {
    inkCount++;
  } else if (command === "J") {
    const inkType = inkTypes[inkTypeIdx];

    const aRange = inkCount;
    for (let a = -aRange; a <= aRange; a++) {
      const bRange = inkCount - Math.abs(a);
      for (let b = -bRange; b <= bRange; b++) {
        const x = p.x + b;
        const y = p.y + a;
        if (checkOOB(x, y)) continue;
        const tile = board[y][x];
        if (tile === "@" || tile === ".") continue;
        board[y][x] = inkType;
      }
    }

    inkTypeIdx = (inkTypeIdx + 1) % I;
    inkCount = 0;
  } else {
    const [dx, dy] = moves[command];
    const [tx, ty] = [p.x + dx, p.y + dy];
    if (checkOOB(tx, ty) || board[ty][tx] !== ".") continue;
    board[p.y][p.x] = ".";
    p.x += dx;
    p.y += dy;
    board[p.y][p.x] = "@";
  }
}

// output
return board.map(row => row.join("")).join("\n");
}
