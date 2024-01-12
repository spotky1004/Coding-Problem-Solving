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
check(`3 4 5
S....
.###.
.##..
###.#

#####
#####
##.##
##...

#####
#####
#.###
####E

1 3 3
S##
#E#
###

0 0 0`,
`Escaped in 11 minute(s).
Trapped!`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const lines = input
  .trim()
  .split("\n");

// code
let line = 0;
const dir = [
  [1, 0, 0], [-1, 0, 0],
  [0, 1, 0], [0, -1, 0],
  [0, 0, 1], [0, 0, -1]
];
const out = [];
caseLoop: while (true) {
  const [L, R, C] = lines[line++].split(" ").map(Number);
  if (L === 0) break;

  let t = 0;
  let queue = [];
  let nextQueue = [];
  const visited = Array.from({ length: L }, _ => Array.from({ length: R }, _ => Array(C).fill(false)));

  // 0: wall, 1: tile, 2: goal
  const building = [];
  for (let i = 0; i < L; i++) {
    const floor = [];
    building.push(floor);
    for (let j = 0; j < R; j++) {
      const row = Array(C).fill(0);
      floor.push(row);
      const cells = lines[line++];
      for (let k = 0; k < C; k++) {
        if (cells[k] === ".") {
          row[k] = 1;
        } else if (cells[k] === "S") {
          nextQueue.push([i, j, k]);
          visited[i][j][k] = true;
        } else if (cells[k] === "E") {
          row[k] = 2;
        }
      }
    }
    line++;
  }

  while (nextQueue.length > 0) {
    t++;
    queue = nextQueue;
    nextQueue = [];

    for (const [i, j, k] of queue) {
      for (const [di, dj, dk] of dir) {
        const [ti, tj, tk] = [i + di, j + dj, k + dk];
        if (
          0 > ti || ti >= L ||
          0 > tj || tj >= R ||
          0 > tk || tk >= C ||
          building[ti][tj][tk] === 0 ||
          visited[ti][tj][tk]
        ) continue;

        if (building[ti][tj][tk] === 2) {
          out.push(`Escaped in ${t} minute(s).`);
          continue caseLoop;
        }
        visited[ti][tj][tk] = true;
        nextQueue.push([ti, tj, tk]);
      }
    }
  }

  out.push("Trapped!");
}

// output
return out.join("\n");
}
