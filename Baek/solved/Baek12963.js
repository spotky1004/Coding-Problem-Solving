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
 * @param {bigint[][]} c capacity (N * N) 
 * @param {number} source 
 * @param {number} sink  
 */
function maximumFlow(c, source, sink) {
  const N = c.length;
  /** @type {bigint[][]} flow */
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
          c[node][to] > f[node][to]
        ) {
          queue.push(to);
          parents[to] = node;

          if (to === sink) break queueLoop;
        }
      }
    }

    if (parents[sink] === -1) break;

    let maxFlow = INF;
    for (let node = sink; node !== source; node = parents[node]) {
      const newMaxFlow = c[parents[node]][node] - f[parents[node]][node];
      if (newMaxFlow < maxFlow)
      maxFlow = newMaxFlow;
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



const caps = Array.from({ length: N }, () => Array(N).fill(0n));
let cap = 1n;
for (const [u, v] of edges) {
  caps[u][v] = cap;
  caps[v][u] = cap;
  cap *= 3n;
}
const INF = cap;
const mod = 1_000_000_007n;

// output
return maximumFlow(caps, 0, N - 1) % mod;
}
