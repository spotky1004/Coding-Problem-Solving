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
0 1
1 2`,
`1`);
check(`4 4
0 1
1 3
0 2
2 3`,
`10`);
check(`3 1
0 1`,
`0`);
check(`5 0`,
`0`);
check(`6 9
1 3
1 2
2 3
0 1
4 5
3 5
0 2
1 4
4 3`,
`39`);
check(`3 3
0 2
0 1
1 2`,
`4`);
check(`3 3
0 2
0 1
1 2`,
`4`);
check(`4 4
0 1
0 3
0 2
2 3
1 2`,
`13`);
check(`4 4
0 1
0 3
2 3
0 2
1 2`,
`12`);
check(`4 4
0 1
2 3
0 2
0 3
1 2`,
`30`);
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
 * @param {number[][]} c capacity (N * N) 
 * @param {number} source 
 * @param {number} sink  
 */
function maximumFlow(c, source, sink) {
  const N = c.length;
  /** @type {number[][]} flow */
  const f = Array.from({ length: N }, _ => Array(N).fill(0n));
  let maxFlowSum = 0n;

  while (true) {
    const parents = Array(N).fill(-1);
    const queue = [source];
    queueLoop: for (const node of queue) {
      for (let to = 0; to < N; to++) {
        if (node === to) continue;
        if (
          parents[to] === -1 &&
          c[node][to] - f[node][to] > 0n
        ) {
          queue.push(to);
          parents[to] = node;

          if (to === sink) break queueLoop;
        }
      }
    }

    if (parents[sink] === -1) break;

    let maxFlow = null;
    for (let node = sink; node !== source; node = parents[node]) {
      const curFlow = c[parents[node]][node] - f[parents[node]][node];
      if (maxFlow === null) {
        maxFlow = curFlow;
        continue;
      }
      if (maxFlow < curFlow) continue;
      maxFlow = curFlow;
    }
    if (maxFlow === 0n) break;
    maxFlowSum += maxFlow;

    for (let node = sink; node !== source; node = parents[node]) {
      f[parents[node]][node] += maxFlow;
      f[node][parents[node]] -= maxFlow;
    }
  }

  return maxFlowSum;
}



const p = 1_000_000_007n;

const capacities = Array.from({ length: N }, _ => Array(N).fill(0n));
let cap = 1n;
for (const [a, b] of edges) {
  capacities[a][b] += cap;
  capacities[b][a] += cap;
  cap *= 3n;
}

// output
return maximumFlow(capacities, N - 1, 0) % p;
}
