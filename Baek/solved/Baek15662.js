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
check(`4
10101111
01111101
11001110
00000010
2
3 -1
1 1`,
`3`);
check(`4
11111111
11111111
11111111
11111111
3
1 1
2 1
3 1`,
`4`);
check(`4
10001011
10000011
01011011
00111101
5
1 1
2 1
3 1
4 1
1 -1`,
`2`);
check(`4
10010011
01010011
11100011
01010101
8
1 1
2 1
3 1
4 1
1 -1
2 -1
3 -1
4 -1`,
`2`);
check(`5
10010011
01010011
11100011
01010101
01010011
10
1 1
2 1
3 1
4 1
1 -1
2 -1
3 -1
4 -1
5 1
5 -1`,
`5`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[T], ...lines] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));
const states = lines.splice(0, T).map(v => v.toString().padStart(8, "0"));
const [K] = lines.shift();
const queries = lines;

// code
const getLState = (idx) => states[idx][6];
const getRState = (idx) => states[idx][2];
const isDif = (l, r) => getRState(l) !== getLState(r);

const rotateL = (idx) => (states[idx] = states[idx].slice(1) + states[idx][0]);
const rotateR = (idx) => (states[idx] = states[idx][7] + states[idx].slice(0, -1));
const rotate = (idx, dir) => dir === 1 ? rotateR(idx) : rotateL(idx);

for (const [idx, dir] of queries) {
  const dirs = Array(T).fill(0);
  dirs[idx - 1] = dir;
  for (let i = idx - 2; i >= 0; i--) {
    if (!isDif(i, i + 1)) break;
    dirs[i] = -dirs[i + 1];
  }
  for (let i = idx; i < T; i++) {
    if (!isDif(i - 1, i)) break;
    dirs[i] = -dirs[i - 1];
  }
  for (let i = 0; i < T; i++) {
    const dir = dirs[i];
    if (dir === 0) continue;
    rotate(i, dir);
  }
}

// output
return states.reduce((a, b, i) => a + (b[0] === "1"), 0);
}
