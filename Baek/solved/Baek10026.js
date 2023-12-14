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
check(`5
RRRBB
GGBBB
BBBRR
BBRRR
RRRRR`,
`4 3`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [, ...board] = input
  .trim()
  .split("\n")
  .map(line => Array.from(line));
const N = board.length;

// code
const moves = [
  [1, 0], [-1, 0],
  [0, 1], [0, -1]
];

/**
 * @param {Map<string, number>} groups 
 */
function search(groups) {
  const visited = Array.from({ length: N }, _ => Array(N).fill(false));
  let count = 0;
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      if (visited[i][j]) continue;

      count++;
      const queue = [[i, j]];
      const group = groups.get(board[i][j]);
      for (const [i, j] of queue) {
        for (const [di, dj] of moves) {
          const [ti, tj] = [i + di, j + dj];
          if (
            0 > ti || ti >= N ||
            0 > tj || tj >= N ||
            groups.get(board[ti][tj]) !== group ||
            visited[ti][tj]
          ) continue;

          visited[ti][tj] = true;
          queue.push([ti, tj]);
        }
      }
    }
  }

  return count;
}

const normal = search(new Map([
  ["R", 0],
  ["G", 1],
  ["B", 2],
]));
const sekyak = search(new Map([
  ["R", 0],
  ["G", 0],
  ["B", 1]
]));

// output
return `${normal} ${sekyak}`;
}
