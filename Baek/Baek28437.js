const isDev = typeof window === "object" || require("fs").existsSync("C:/users/spotky");

if (!isDev) {
  const input = require("fs").readFileSync("/dev/stdin").toString();
  const out = solve(input);
  console.log(out);
} else {
  let CASE_NR = 0;
  function check(input, answer) {
    CASE_NR++;
    const startTime = new Date().getTime();
    const startMemory = process.memoryUsage().heapUsed / 1024;
    const out = solve(input);
    const timeDeltaStr = (new Date().getTime() - startTime).toString();
    const timeDeltaZeroStr = " "+"0".repeat(6 - timeDeltaStr.length);
    const memoryDelta = ((process.memoryUsage().heapUsed / 1024) - startMemory).toFixed(0);
    const memoryDeltaZeroStr = " "+"0".repeat(8 - memoryDelta.length);
    if (
      typeof answer === "string" ?
        out.toString() === answer :
        answer.includes(out)
    ) console.log("\x1b[1m%s\x1b[42m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[0m", `Case ${CASE_NR}: `, ` AC `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB");
    else console.log("\x1b[1m%s\x1b[41m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[31m%s\x1b[0m", `Case ${CASE_NR}: `, ` WA `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB\n", out);
  }

// cases
check(`5
1 2 3 4 5
6
1 2 3 4 5 6`,
`1 2 2 4 2 5`);
}

function solve(input) {
// input
const [[N], A, [Q], L] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const stickCounts = Array(100001).fill(0);
for (let i = 0; i < N; i++) {
  stickCounts[A[i]]++;
}

const dp = [0];
for (let i = 1; i < 100001; i++) {
  let sum = stickCounts[i];
  const sqrt = Math.ceil(Math.sqrt(i + 1));
  const fac = [];
  for (let j = 0; j <= sqrt; j++) {
    if (i % j !== 0) continue;
    sum += dp[j] ?? 0;
    fac.push(i / j);
  }
  for (const f of fac) {
    if (f <= sqrt) continue;
    sum += dp[f] ?? 0;
  }
  dp.push(sum);
}

const out = [];
for (let i = 0; i < Q; i++) {
  out.push(dp[L[i]]);
}

// output
return out.join(" ");
}
