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
check(`3
1 0
0 -1
1 -1`,
`-1 2
3 2 1
1 2
1 2 3`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], ...scores] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const p = 998_244_353n;
const combs = [1n];
for (let i = 1; i <= N; i++) {
  combs.push(combs[i - 1] * BigInt(i) % p);
}

const constSum = scores.reduce((a, b) => a + BigInt(b[1] * (N - 1)), 0n);
const sortedScores = scores
  .map(([ci, ai], i) => [i, BigInt(ci - ai)])
  .sort((a, b) => Number(a[1] - b[1]));
const sortedIdxes = sortedScores.map(v => v[0] + 1);
const sortedValues = sortedScores.map(v => v[1]);

let minScore = constSum;
let maxScore = constSum;
let combCount = 1n;
let prev;
let sameCount = 1;
for (let i = 0; i < N; i++) {
  const cur = sortedValues[i];
  if (cur !== prev) {
    combCount = combCount * combs[sameCount] % p;
    sameCount = 0;
    prev = cur;
  }
  sameCount++;

  minScore += cur * BigInt(N - i - 1);
  maxScore += cur * BigInt(i);
}
combCount = combCount * combs[sameCount] % p;

// output
return `${minScore} ${combCount}
${[...sortedIdxes].reverse().join(" ")}
${maxScore} ${combCount}
${sortedIdxes.join(" ")}`;
}
