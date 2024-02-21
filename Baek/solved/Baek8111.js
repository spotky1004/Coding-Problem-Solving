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
check(`6
17
11011
17
999
125
173`,
`11101
11011
11101
111111111111111111111111111
1000
1011001101`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [T, ...cases] = input
  .trim()
  .split("\n")
  .map(Number);

// code
const out = [];
for (const N of cases) {
  if (N === 1) {
    out.push(1);
    continue;
  }

  /** @type {([prev: number, pos: number] | null)[]} */
  const dp = Array(N).fill(null);
  dp[1] = [-1, 0];

  let pos = 0;
  let value = 1;
  while (true) {
    pos++;
    value = (value * 10) % N;
    if (pos >= 100) break;

    for (let i = 0; i < N; i++) {
      if (dp[i] === null || dp[i][1] === pos) continue;
      const target = (i + value) % N;
      if (dp[target] !== null) continue;
      dp[target] = [i, pos];
    }
    if (dp[value] === null) dp[value] = [-1, pos];
  }
  
  if (dp[0] === null) {
    out.push("BRAK");
    continue;
  }

  const num = Array(dp[0][1] + 1).fill(0);
  for (let mod = 0; mod !== -1; mod = dp[mod][0] !== -1 ? dp[mod][0] : -1) {
    num[dp[mod][1]] = 1;
  }
  out.push(num.reverse().join(""));
}

// output
return out.join("\n");
}
