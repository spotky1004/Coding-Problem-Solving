const isWeb = typeof window === "object";
const isDev = isWeb || require("fs").existsSync("C:/users/spotky");

if (!isDev) {
  const input = require("fs").readFileSync("/dev/stdin").toString();
  const out = solve(input);
  console.log(out);
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
check(`3 5 10
5 3 7`,
`10`);
check(`4 8 20
15 2 9 10`,
`-1`);
check(`14 40 243
74 39 127 95 63 140 99 96 154 18 137 162 14 88`,
`238`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, S, M], diffs] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
let dp = Array(M + 1).fill(false);
dp[S] = true;
for (const diff of diffs) {
  const newDp = Array(M + 1).fill(false);
  for (let i = 0; i <= M; i++) {
    if (!dp[i]) continue;
    const a = i - diff;
    const b = i + diff;
    if (a >= 0 && a <= M) newDp[a] = true;
    if (b >= 0 && b <= M) newDp[b] = true;
  }
  dp = newDp;
}

let maxVolume = -1;
for (let i = 0; i <= M; i++) {
  if (dp[i]) maxVolume = i;
}

// output
return maxVolume;
}
