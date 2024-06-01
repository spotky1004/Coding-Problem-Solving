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
check(`2
3
0 0 0
0 0 0
1`,
`ALIVE`);
check(`2
2
0 0
0 1
5`,
`DEAD`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], [M], ...board] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));
const X = board.pop()[0];

// code
const queue = [[0, 0]];
board[0][0] ^= 1;
for (const [r, c] of queue) {
  if (r === N - 1 && c === M - 1) return "ALIVE";

  for (let tr = 0; tr < N; tr++) {
    for (let tc = 0; tc < M; tc++) {
      if (
        board[tr][tc] === board[0][0] ||
        X < Math.abs(r - tr) + Math.abs(c - tc)
      ) continue;
      queue.push([tr, tc]);
      board[tr][tc] ^= 1;
    }
  }
}

// output
return "DEAD";
}
