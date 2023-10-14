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
check(`5
R G R B G
4 5
1 2 R
1 3 G
2 3 G
1 4 R
4 3 B`,
`40`);
check(`5
R R R R R
2 1
1 2 R`,
`50`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
let [[N], cards, [M, K], ...edges] = input
  .trim()
  .split("\n")
  .map(line => line.split(" "));
[N, M, K] = [N, M, K].map(Number);

// code
const connections = Array.from({ length: M }, _ => []);
for (const [a, b, color] of edges) {
  connections[a - 1].push([b - 1, color]);
  connections[b - 1].push([a - 1, color]);
}

let dp = Array(M).fill(null);
dp[0] = 0;
for (let i = 0; i < N; i++) {
  const newDp = Array(M).fill(0);
  for (let j = 0; j < M; j++) {
    if (dp[j] === null) newDp[j] = null;
  }
  const curCard = cards[i];
  for (let node = 0; node < M; node++) {
    if (dp[node] === null) continue;

    for (const [to, color] of connections[node]) {
      const score = dp[node] + (curCard === color ? 10 : 0);
      newDp[to] = Math.max(newDp[to], score);
    }
  }

  dp = newDp;
}

// output
return Math.max(0, ...dp);
}
