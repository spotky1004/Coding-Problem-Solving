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

  function judge(input, ans) {
    const [[N, M], ...board] = input
      .trim()
      .split("\n")
      .map(line => line.split(" ").map(Number));
    const moves = ans.split("\n").slice(1).map(v => v.split(" "));

    if (moves.length > 2 * (N + M)) return false;
    let xorVal = 0;
    for (const [y, x] of moves) xorVal ^= board[y][x];
    return xorVal === 0;
  }

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
    if (judge(input, out)) console.log("\x1b[1m%s\x1b[42m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[0m", `${caseName}: `, ` AC `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB");
    else console.log("\x1b[1m%s\x1b[41m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[31m%s\x1b[0m", `${caseName}: `, ` WA `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB\n", out.slice(0, 10000));
  }

// cases
check(`2 3
1 3 5
1 2 6`,
``);
check(`2 2
1 2
1 3`,
``);
check(`4 5
1 1 1 1 1
1 1 1 1 1
1 1 1 1 1
1 1 1 1 1`,
``);
check(`4 4
1 1 1 1
1 1 1 1
1 1 1 1
1 1 1 1`,
``);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, M]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const toVisit = [];
for (let x = 0; x < M; x++) toVisit.push(`0 ${x}`);
for (let y = 1; y < N; y++) toVisit.push(`${y} ${M - 1}`);
if (toVisit.length % 2 === 1) toVisit.splice(-1, 0, `${N - 1} ${M - 2}`);

const path = [];
for (let i = 0; i < toVisit.length; i += 2) {
  const a = toVisit[i];
  const b = toVisit[i + 1];
  path.push(a, b, a, b);
}

// output
return `${path.length}\n${path.join("\n")}`;
}
