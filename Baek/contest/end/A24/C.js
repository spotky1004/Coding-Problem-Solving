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
check(`4 4 3
1 1
1 3
3 1`,
`4`);
check(`4 4 4
1 1
1 3
3 1
3 3`,
`6`);
check(`10 10 5
1 1
3 3
5 5
7 7
9 9`,
`32`);
check(`10 10 5
1 9
3 7
5 5
7 3
9 1`,
`6`);
check(`6 4 3
1 1
2 1
1 3
2 3
4 1
5 1`,
`4`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[R, C, K], ...gajis] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const mod = 1_000_000_007;
const dp = Array(R + 1).fill(0);
dp[0] = 1;
const field = Array.from({ length: R + 1 }, () => Array(C + 1).fill(false));
for (const [r, c] of gajis) {
  field[r][c] = true;
}

for (let c = 0; c <= R; c++) {
  let acc = 0;
  for (let r = 0; r < C; r++) {
    acc += dp[r];
    if (field[r][c]) {
      dp[r + 1] = (dp[r + 1] + acc) % mod;
      acc = 0;
    }
    if (field[r][c]) {
      dp[r] = 0;
    }
    console.log(c, r, acc);
  }
  console.log(dp);
}

// output
return dp.reduce((a, b) => a + b, 0) % mod;
}
