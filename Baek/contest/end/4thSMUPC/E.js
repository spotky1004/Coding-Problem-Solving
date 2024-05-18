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
check(`3 5 2
2 1 0
3 1 0
1 3 0
3 2 2
3 2 2`,
`4`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, M, K], ...matches] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const scores = Array(N).fill(0);
const waitings = [];
for (const match of matches) {
  if (match[2] !== 0) scores[match[match[2] - 1] - 1]++;
  else waitings.push(match);
}

const myScore = scores[K - 1];
scores[K - 1] = 0;
const maxOpp = Math.max(...scores);
scores[K - 1] = myScore;

let count = 0;
for (let mask = (1 << waitings.length) - 1; mask >= 0; mask--) {
  let subMaxOpp = maxOpp;
  for (let i = 0; i < waitings.length; i++) {
    const winIdx = waitings[i][Math.sign(mask & (1 << i))] - 1;
    scores[winIdx]++;
    if (winIdx + 1 !== K) subMaxOpp = Math.max(subMaxOpp, scores[winIdx]);
  }
  const subMyScore = scores[K - 1];
  if (subMyScore > subMaxOpp) count++;

  for (let i = 0; i < waitings.length; i++) {
    const winIdx = waitings[i][Math.sign(mask & (1 << i))] - 1;
    scores[winIdx]--;
  }
}

// output
return count;
}
