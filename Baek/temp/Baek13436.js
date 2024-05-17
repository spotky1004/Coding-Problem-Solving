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
check(`5 3
1 3 5`,
`1`);
check(`6 3
1 4 2`,
`1`);
check(`7 3
2 4 7`,
`2`);
check(`7 6
1 2 3 4 6 5`,
`0`);
// check(`15 3
// 1 9 4`,
// `13856216`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, M], P] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const pairs = [];
for (let i = 0; i <= N; i++) {
  const row = [];
  pairs.push(row);
  for (let j = 0; j <= N; j++) row.push([i, j].sort((a, b) => a - b));
}

const visited = Array(N + 1).fill(false);
visited[0] = true;
const edges = [];
for (let i = 0; i < M; i++) {
  visited[P[i]] = true;
  if (i !== 0) edges.push(pairs[P[i - 1]][P[i]]);
}

const nodes = [[-1, null, null]];
for (let i = 1; i <= N; i++) {
  if (visited[i]) continue;
  const node = [i, nodes[nodes.length - 1], null];
  nodes[nodes.length - 1][2] = node;
  nodes.push(node);
}
const root = nodes[0];
nodes[nodes.length - 1][2] = root;
root[1] = nodes[nodes.length - 1];

function canAdd(i, j) {
  for (const [a, b] of edges) {
    if (
      !(
        a === i || b === i ||
        a === j || b === j
      ) &&
      (
        (
          a < i && i < b &&
          (b < j || j < a)
        ) ||
        (
          a < j && j < b &&
          (b < i || i < a)
        )
      )
    ) return 1;
  }
  return 0;
}

const dp = Array(1 << N).fill(0);


// output
return 1;
}
