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
check(`21 11 4
1 4 0 16 10
1 7 0 13 10
2 10 5 5
2 10 5 3`,
`....###...#...###....
....###..###..###....
....###.##.##.###....
....#####...#####....
....##.#.....#.##....
....#...........#....
....##.#.....#.##....
....#####...#####....
....###.##.##.###....
....###..###..###....
....###...#...###....`);
check(`10 10 2
1 4 4 8 8
2 4 5 3`,
`..........
..........
....#.....
...###....
..##...##.
.###....#.
..##...##.
...#..###.
.....####.
..........`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[W, H, K], ...shapes] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
/**
 * @param {number} x 
 * @param {number} y 
*/
function checkOOB(x, y) {
  if (
    0 > x || x >= W + offset * 2 ||
    0 > y || y >= H + offset * 2
  ) return true;
  return false;
}



const offset = 2;
const squareImos = Array.from({ length: H + offset * 2 }, _ => Array(W + offset * 2).fill(0));
//          d
const diamonImos = Array.from({ length: H + offset * 2 }, _ => Array(W + offset * 2).fill(0));
for (const [type, p0, p1, p2, p3] of shapes) {
  if (type === 1) {
    const [px, py, qx, qy] = [p0, p1, p2, p3];
    squareImos[py + offset][px + offset]++;
    squareImos[py + offset][qx + 1 + offset]--;

    squareImos[qy + 1 + offset][px + offset]--;
    squareImos[qy + 1 + offset][qx + 1 + offset]++;
  } else {
    const [px, py, r] = [p0, p1, p2];
    diamonImos[py - r + offset][px + offset]++;
    diamonImos[py - r + 1 + offset][px + offset]++;
    diamonImos[py + 1 + offset][px + r + 1 + offset]--;
    diamonImos[py + 1 + offset][px + r + offset]--;

    diamonImos[py + 1 + offset][px - r - 1 + offset]--;
    diamonImos[py + 1 + offset][px - r + offset]--;
    diamonImos[py + r + 1 + offset][px + offset]++;
    diamonImos[py + r + 2 + offset][px + offset]++;
  }
}

for (let x = 1; x < W + offset * 2; x++) {
  for (let y = 0; y < H + offset * 2; y++) {
    squareImos[y][x] += squareImos[y][x - 1];
  }
}
for (let y = 1; y < H + offset * 2; y++) {
  for (let x = 0; x < W + offset * 2; x++) {
    squareImos[y][x] += squareImos[y - 1][x];
  }
}

for (let d = 1; d < W + H + offset * 2 - 1; d++) {
  for (let e = 1; e < d; e++) {
    const x = d + 1 - e;
    const y = e;
    if (checkOOB(x, y) || checkOOB(x - 1, y - 1)) continue;
    diamonImos[y][x] += diamonImos[y - 1][x - 1];
  }
}

for (let d = 1; d < W + H + offset * 2 - 1; d++) {
  for (let e = 1; e < d; e++) {
    const x = W + offset * 2 - 1 - d + e;
    const y = e;
    if (checkOOB(x, y) || checkOOB(x + 1, y - 1)) continue;
    diamonImos[y][x] += diamonImos[y - 1][x + 1];
  }
}

const out = Array.from({ length: H }, _ => Array(W));
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const value = squareImos[y + offset][x + offset] + diamonImos[y + offset][x + offset];
    out[y][x] = value % 2 === 0 ? "." : "#";
  }
}

// output
return out.map(line => line.join("")).join("\n");
}
