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
check(`3
5 3
3 2
2 6`,
`90`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], ...mats] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const dp = Array.from({ length: N + 1 }, () => Array(N).fill(-1));
for (let i = 0; i < N; i++) dp[1][i] = 0;
function search(len, l) {
  if (dp[len][l] !== -1) return dp[len][l];

  const r = l + len - 1;
  let minOp = Infinity;
  for (let i = l + 1; i <= r; i++) {
    const ll = l, lr = i - 1;
    const rl = i, rr = r;
    const n = mats[ll][0], m = mats[lr][1], k = mats[rr][1];
    // console.log([l, r], i, [ll, lr], search(lr - ll + 1, ll), [rl, rr], search(rr - rl + 1, rl), [n, m, k], n * m * k);
    minOp = Math.min(
      minOp,
      search(lr - ll + 1, ll) + search(rr - rl + 1, rl) + (n * m * k)
    );
  }

  dp[len][l] = minOp;
  return minOp;
}
search(N, 0, N - 1)

// output
return search(N, 0, N - 1);
}
