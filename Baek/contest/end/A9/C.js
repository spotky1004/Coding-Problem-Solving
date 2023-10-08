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
check(`3 2
1 2
2 3`,
`7`);
check(`3 3
1 2
1 3
2 3`,
`5`);
check(`1 0`,
`1`);
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
const connections = Array.from({ length: N + 1 }, _ => []);
for (const [a, b] of edges) {
  connections[a].push(b);
  connections[b].push(a);
}

const visited = Array(N + 1).fill(false);
const childs = Array.from({ length: N + 1 }, _ => []);
const queue = [1];
visited[1] = true;
for (const node of queue) {
  for (const child of connections[node]) {
    if (visited[child]) continue;
    visited[child] = true;
    childs[node].push(child);
    queue.push(child);
  }
}

const depthNodeCounts = Array(N + 1).fill(0);
function init(node = 1, depth = 0) {
  depthNodeCounts[depth]++;
  for (const child of childs[node]) {
    init(child, depth + 1);
  }
}
init();

const p = 1_000_000_007n;
let count = 1n;
for (const depthNodeCount of depthNodeCounts) {
  if (depthNodeCount === 0) continue;
  count = (count * BigInt(depthNodeCount + 1)) % p;
}
count = (count - 1n + p) % p;

// output
return count.toString();
}
