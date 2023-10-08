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
check(`7 7
2 3 1 4 5 1 3
3 4 2 8 6 1 2
0 1 2 0 4 0 0`,
`9`);
check(`5 13
2 5 3 1 1
4 2 5 6 3
0 1 2 0 4`,
`-1`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, S], w, t, p] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
/** @type {[pi: number, wi: number, ti: number][][]} */
const workLines = [];
for (let i = 0; i < N; i++) {
  if (p[i] !== 0) continue;

  let next = i + 1;
  const workLine = [];
  workLines.push(workLine);
  while (true) {
    workLine.push([next, w[next - 1], t[next - 1]]);
    next = p.findIndex(v => v === next) + 1;
    if (next === 0) break;
  }
}

const minTimes = Array(100 * 1000 + 1).fill(Infinity);
for (let i = 0; i < workLines.length; i++) {
  const workLine = workLines[i];

  const workSuffixs = [];
  let wSum = 0;
  let tSum = 0;
  for (const [, w, t] of workLine) {
    wSum += w;
    tSum += t;
    workSuffixs.push([wSum, tSum]);
  }
  workSuffixs.reverse();

  for (let i = 100 * 10000; i >= 0; i--) {
    if (!isFinite(minTimes[i])) continue;
    const minTime = minTimes[i];
    for (const [w, t] of workSuffixs) {
      const newScore = i + w;
      const newTime = minTime + t;
      if (minTimes[newScore] <= newTime) continue;
      minTimes[newScore] = newTime;
    }
  }

  for (const [w, t] of workSuffixs) {
    if (
      minTimes[w] <= t &&
      minTimes[w] !== -1
    ) continue;
    minTimes[w] = t;
  }
}

const out = minTimes.slice(S).reduce((a, b) => Math.min(a, b), Infinity);

// output
return !isFinite(out) ? -1 : out;
}
