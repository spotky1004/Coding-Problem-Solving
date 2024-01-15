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
2 2
1 1 E
5 4 W
1 F 7
2 F 7`,
`Robot 1 crashes into the wall`);
check(`1 3
2 1
1 1 N
1 2 N
1 F 2`,
`Robot 1 crashes into robot 2`);
check(`1 1
1 1
1 1 E
1 F 1`,
`Robot 1 crashes into the wall`);
check(`5 4
2 2
1 4 E
5 4 W
1 F 3
2 F 1`,
`Robot 2 crashes into robot 1`);
check(`3 3
1 9
2 2 W
1 F 1
1 L 1
1 F 1
1 L 1
1 F 2
1 L 5
1 F 2
1 R 3
1 F 2`,
`OK`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const lines = input
  .trim()
  .split("\n")
  .map(line => line.split(" "));
const dirOrder = new Map([
  ["N", 0],
  ["E", 1],
  ["S", 2],
  ["W", 3]
]);
const [W, H] = lines.shift().map(Number);
const [N, M] = lines.shift().map(Number);
const robots = lines.splice(0, N).map(v => [Number(v[0]) - 1, Number(v[1]) - 1, dirOrder.get(v[2])]);
const queries = lines.map(v => [Number(v[0]) - 1, v[1], Number(v[2])]);

// code
const dir = [
  [1, 0], [0, 1],
  [-1, 0], [0, -1]
];
const robotStatus = [];
const board = Array.from({ length: H }, _ => Array(W).fill(-1));
for (let r = 0; r < N; r++) {
  const [j, i, d] = robots[r];
  board[i][j] = r;
  robotStatus.push([i, j, d]);
}

function moveRobot(r) {
  const [i, j, d] = robotStatus[r];
  const [di, dj] = dir[d];
  
  const [ti, tj] = [i + di, j + dj];
  if (
    0 > ti || ti >= H ||
    0 > tj || tj >= W
  ) return -1;
  if (board[ti][tj] !== -1) return board[ti][tj];

  robotStatus[r][0] = ti;
  robotStatus[r][1] = tj;
  board[i][j] = -1;
  board[ti][tj] = r;
  return true;
}

for (const [r, type, loop] of queries) {
  if (type === "F") {
    for (let i = 0; i < loop; i++) {
      const result = moveRobot(r);
      if (result === true) continue;
      if (result === -1) return `Robot ${r + 1} crashes into the wall`;
      return `Robot ${r + 1} crashes into robot ${result + 1}`;
    }
  } else if (type === "R") {
    robotStatus[r][2] = (robotStatus[r][2] + loop) % 4;
  } else if (type === "L") {
    robotStatus[r][2] = (((robotStatus[r][2] - loop) % 4) + 4) % 4;
  }
}

// output
return "OK";
}
