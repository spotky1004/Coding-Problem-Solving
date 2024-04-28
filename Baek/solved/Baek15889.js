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
0 5 10 15 100
10 5 6 100`,
`권병장님, 중대장님이 찾으십니다`);
check(`5
0 5 10 15 100
10 5 6 0`,
`엄마 나 전역 늦어질 것 같아`);
check(`1
0`,
`권병장님, 중대장님이 찾으십니다`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], poses, lens] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
if (N === 1) return "권병장님, 중대장님이 찾으십니다";

let maxLen = 0;
for (let i = 0; i < N; i++) {
  const pos = poses[i];
  const len = lens[i];
  if (maxLen < pos) return "엄마 나 전역 늦어질 것 같아";
  maxLen = Math.max(maxLen, pos + len);
}

// output
return "권병장님, 중대장님이 찾으십니다";
}
