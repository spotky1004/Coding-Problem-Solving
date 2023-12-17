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
check(`5 8 4
7 1 2 3 5
3`,
`YES`);
check(`5 8 3
7 1 2 3 5
3`,
`NO`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, M, T], Q, [P]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const padang = Q[P - 1];
const dp = Array(M + 1).fill(-1);

const lCount = P - 1;
const rCount = N - P;
let maxR = -1;
for (let l = lCount; l >= 0; l--) {
  if (l > T) continue;
  let r = 0;
  for (let rp = rCount; rp >= 0; rp--) {
    const minTime = Math.min(rp + l * 2, rp * 2 + l);
    if (minTime > T) continue;
    r = rp;
    break;
  }

  if (maxR >= r) continue;
  maxR = r;

  const avaiables = Q.slice(P - 1 - l, P - 1).concat(Q.slice(P, P + r)).sort((a, b) => a - b);
  let max = padang;
  dp[padang] = l;
  for (const q of avaiables) {
    for (let i = max; i >= 0; i--) {
      const add = i + q;
      if (dp[i] !== l || add > M) continue;
      max = Math.max(max, add);
      dp[add] = l;
      if (add === M) return "YES";
    }
  }
  if (dp[M] === l) return "YES";
}

// output
return "NO";
}
