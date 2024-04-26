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
check(`3 5
42101
22100
22101`,
`9`);
check(`2 2
12
34`,
`1`);
check(`2 4
1255
3455`,
`4`);
check(`1 10
1234567890`,
`1`);
check(`11 10
9785409507
2055103694
0861396761
3073207669
1233049493
2300248968
9769239548
7984130001
1670020095
8894239889
4053971072`,
`49`);
check(`4 5
11001
22222
33333
41441`,
`16`);
check(`4 6
000001
000010
000100
001000`,
`16`);
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
const M = board[0].length;
let maxArea = 1;
for (let x1 = 0; x1 < M; x1++) {
  for (let y1 = 0; y1 < N; y1++) {
    for (let x2 = 0; x2 < M; x2++) {
      for (let y2 = 0; y2 < N; y2++) {
        const w = Math.abs(x2 - x1) + 1;
        const h = Math.abs(y2 - y1) + 1
        if (
          w !== h ||
          board[y1][x1] !== board[y1][x2] ||
          board[y1][x1] !== board[y2][x1] ||
          board[y1][x1] !== board[y2][x2]
        ) continue;
        const area = w * (Math.abs(y2 - y1) + 1);
        maxArea = Math.max(maxArea, area);
      }
    }
  }
}

// output
return maxArea;
}
