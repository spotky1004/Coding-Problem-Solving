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
check(`5
....X
..XX.
.....
.XX..
X....`,
`5 4`);
check(`5
....X
...X.
..X..
.X...
X....`,
`6 6`);
check(`5
...XX
..XX.
.XX..
XX...
XXXXX`,
`4 4`);
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

// code
const N = board.length;
const items = [];
for (let i = 0; i < N; i++) {
  for (let j = 0; j < N; j++) {
    if (board[i][j] !== "X") continue;
    items.push([j + 1, i + 1]);
  }
}
const baseCount = BigInt(N);
const add = Array(2).fill(0n);

function hashPos(pos) {
  let out = 0;
  for (let i = 0; i < 2; i++) {
    out += (pos[i] - 1) * N**i;
  }
  return out;
}
const hashed = new Set(items.map(hashPos));
for (const item of items) {
  for (let i = 0; i < 2; i++) {
    // if (2 === item[i] || item[i] === N - 1) add[i]--;
    if (
      item[i] !== 1 &&
      item[i] + 1 <= N
    ) {
      item[i]++;
      if (!hashed.has(hashPos(item))) add[i]++;
      item[i]--;
    }
  }
  console.log(item, add);
}
console.log(baseCount, add);

const out = [];
for (let i = 0; i < 2; i++) out.push(baseCount + add[i]);

// output
return out.join(" ");
}
