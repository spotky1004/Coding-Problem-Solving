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
check(`2
4
40 30 30 50
15
1 21 3 4 5 35 5 4 3 5 98 21 14 17 32`,
`300
864`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[T], ...lines] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const out = [];
for (let caseNr = 0; caseNr < T; caseNr++) {
  const [K] = lines[caseNr * 2];
  const sizes = lines[caseNr * 2 + 1];

  const dp = Array.from({ length: K }, () => Array(K).fill(null));
  dp[0] = sizes.map(size => [0, size]);

  function search(len, start) {
    if (dp[len - 1][start] !== null) return dp[len - 1][start];

    let size = null;
    let minCost = Infinity;
    for (let i = 1; i < len; i++) {
      const [cost1, size1] = search(i, start);
      const [cost2, size2] = search(len - i, start + i);
      size = size1 + size2;
      minCost = Math.min(minCost, cost1 + cost2 + size1 + size2);
    }
    dp[len - 1][start] = [minCost, size];
    return [minCost, size];
  }
  out.push(search(K, 0)[0]);
}

// output
return out.join("\n");
}
