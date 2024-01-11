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
check(`6 6
1 5
3 4
5 4
4 2
4 6
5 2`,
`1`);
// check(`5 5
// 1 5
// 3 4
// 5 4
// 4 2
// 5 2`,
// `2`);
// check(`6 7
// 1 3
// 1 5
// 3 4
// 5 4
// 4 2
// 4 6
// 5 2`,
// `2`);
// check(`6 3
// 1 2
// 2 3
// 4 5`,
// `0`);
// check(`6 3
// 6 5
// 5 4
// 4 3`,
// `0`);
// check(`6 5
// 6 5
// 5 4
// 4 3
// 3 2
// 1 2`,
// `1`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, M], ...edges] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
/**
 * @param {number} V 
 * @param {number[][]} costs 
 */
function floydWarshall(costs) {
  const V = costs.length;

  for (let k = 0; k < V; k++) {
    for (let i = 0; i < V; i++) {
      for (let j = 0; j < V; j++) {
        costs[i][j] = Math.min(costs[i][j], costs[i][k] + costs[k][j]);
      }
    }
    console.table(costs);
  }
}

const costs = Array.from({ length: N }, _ => Array(N).fill(Infinity));
for (let i = 0; i < N; i++) {
  costs[i][i] = 0;
}
for (const [a, b] of edges) {
  costs[a - 1][b - 1] = 1;
  costs[b - 1][a - 1] = 1;
}

console.table(costs);
void floydWarshall(costs);
console.table(costs);

// output
return 0;
}
