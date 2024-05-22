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
1 1 2
3 1 1
1 3 1
10 20 5
3 3 1`,
`4`);
check(`2
1 1 1
2 2 2`,
`2`);
check(`1
3 2 1`,
`0`);
check(`9
1 1 1
2 100 2
100 3 3
5 100 4
100 7 5
10 100 6
100 13 7
17 100 8
100 21 1`,
`9`);
check(`10
1 1 1
10 5 1
1 1 1
2 8 2
16 3 1
12 5 1
13 3 2
19 16 3
12 19 5
8 20 1`,
`7`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], ...quests] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const seen = Array.from({ length: 1001 }, () => Array(1001).fill(false));
function search(str, int) {
  if (seen[str][int]) return 0;
  seen[str][int] = true;

  let completed = 0;
  let pnt = 0;
  for (const [stri, inti, pnti] of quests) {
    if (stri <= str || inti <= int) {
      completed++;
      pnt += pnti;
    }
  }
  const pntLeft = pnt - str - int + 2;
  const allocated = [str + pntLeft, int];
  if (allocated[0] > 1000) {
    allocated[1] = Math.min(1000, allocated[1] + allocated[0] - 1000);
    allocated[0] = 1000;
  }
  while (allocated[0] >= str) {
    completed = Math.max(completed, search(allocated[0], allocated[1]));
    allocated[0]--;
    allocated[1]++;
  }
  return completed;
}

// output
return search(1, 1);
}
