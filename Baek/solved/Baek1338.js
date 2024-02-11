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
check(`1 10
10 5`,
`5`);
check(`1 10
7 2`,
`Unknwon Number`);
check(`-1 4
4 0`,
`Unknwon Number`);
check(`2147483647 2147483647
1 0`,
`2147483647`);
check(`1 10
7 2`,
`Unknwon Number`);
check(`1 3
10 7`,
`Unknwon Number`);
check(`-1 -3
10 7`,
`-3`);
check(`1 2
0 1`,
`Unknwon Number`);
check(`0 20
20 16`,
`16`);
check(`0 0
0 0`,
`0`);
check(`0 4
4 0`,
`Unknwon Number`);
check(`0 3
4 0`,
`0`);
check(`-2147483648 2147483646
-2147483648 2147483647`,
`-1`);
}

/**
 * @param {string} input
 */
function solve(input) {
// input
let [[l, r], [x, y]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
if (l > r) [l, r] = [r, l];
if (x < 0) x = Math.abs(x);
if (y < 0) return "Unknwon Number";

if (x === 0 && y === 0 && l === 0 && r === 0) return 0;
if (x === 0) return "Unknwon Number";
if (x <= y) return "Unknwon Number";

const ans = Math.ceil((l - y) / x) * x + y;
if (r < ans || ans + x <= r) return "Unknwon Number";

// output
return ans;
}
