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
check(`100`,
`3`);
}

function genDP(N) {
  const dp = Array.from({ length: N }, _ => Array(N).fill(null))
  function test(cnt, max) {
    max = Math.min(cnt, max);
    if (max <= 0) {
      dp[cnt][max] = false;
      return false;
    }
    if (dp[cnt][max] !== null) return dp[cnt][max];

    let result = false;
    for (let i = 1; i <= max; i++) {
      if (test(cnt - i, i * 2)) continue;
      result = true;
      break;
    }
    dp[cnt][max] = result;
    return result;
  }

  for (let i = 1; i < N; i++) {
    for (let j = 1; j <= i; j++) {
      void test(i, j);
    }
  }

  const out = [];
  for (let i = 0; i < N; i++) {
    let minCount = -1
    for (let j = 0; j < i; j++) {
      if (!dp[i][j]) continue;
      minCount = j;
      break;
    }
    out.push(minCount);
  }

  return out;
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const fibs = [1, 1];
for (let i = 2; i < 30; i++) {
  fibs.push(fibs[i - 1] + fibs[i - 2]);
}

const seq = [1];
for (const fib of fibs) {
  let i = 0;
  while (seq.length < fib - 1) {
    seq.push(seq[i]);
    i++;
  }
  if (seq.length === fib - 1) {
    seq.push(fib);
  }
}

const dp = [-1, -1, -1, -1];
let fibIdx = 2;
let seqIdx = 0;
while (dp.length <= N) {
  if (seqIdx === fibs[fibIdx] - 1) {
    fibIdx++;
    seqIdx = 0;
    dp.push(-1);
  }
  dp.push(seq[seqIdx]);
  seqIdx++;
}

// const realDP = genDP(10000);
// console.log(realDP.slice(0, 5000).toString() === dp.slice(0, 5000).toString())

// output
return dp[N];
}
