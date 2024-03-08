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
check(`12
24 3
24 2
2 1
1 1
4 2
18 3
17 1
17 3
17 4
100 5
1000 10
1120 14`,
`2
3
1
0
0
2
1
0
1
55
200102899
2079324314`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[T], ...cases] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
/**
 * @param {number} n 
*/
function genPrimes(n) {
  /** @type {number[]} */
  const primes = [];
  const net = Array(n).fill(true);
  for (let i = 2; i <= n; i++) {
    if (net[i]) primes.push(i);
    for (const p of primes) {
      const a = i * p;
      if (a > n) break;
      net[a] = false;
      if (i % p === 0) break;
    }
  }
  return primes;
}



const primes = genPrimes(1120);
const dp = Array.from({ length: 1120 + 1 }, () => Array(15).fill(0));
for (const p of primes) {
  for (let i = 1120 - p; i >= 1; i--) {
    for (let j = 1; j <= 13; j++) {
      dp[i + p][j + 1] += dp[i][j];
    }
  }
  dp[p][1]++;
}

const out = [];
for (const [n, k] of cases) {
  out.push(dp[n][k]);
}

// output
return out.join("\n");
}
