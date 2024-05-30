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
check(`weissblume
exupery
weeisxsbulupmerey`,
`11211211211212212`);
check(`novine
vesna
novesvinena`,
`11222111122`);
check(`tata
mama
mtatamaa`,
`21112212`);
check(`hsin
sinh
hsinhsin`,
`12222111`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [A, B, S] = input
  .trim()
  .split("\n");

// code
const dp = Array.from({ length: S.length + 1 }, () => Array.from({ length: A.length + 1 }, () => Array(B.length + 1).fill(-1)));
dp[0][0][0] = 0;
for (let i = 1; i <= S.length; i++) {
  for (let j = 0; j <= A.length; j++) {
    const k = i - j;
    if (j > A.length || k > B.length) continue;
    if (
      S[i - 1] === A[j - 1] &&
      dp[i - 1][j - 1][k] !== -1
    ) dp[i][j][k] = 1;
    if (
      S[i - 1] === B[k - 1] &&
      dp[i - 1][j][k - 1] !== -1
    ) dp[i][j][k] = 2;
  }
}

const out = [];
const cur = [A.length, B.length];
while (cur[0] !== 0 || cur[1] !== 0) {
  const value = dp[cur[0] + cur[1]][cur[0]][cur[1]];
  out.push(value);
  cur[value - 1]--;
}

// output
return out.reverse().join("");
}
