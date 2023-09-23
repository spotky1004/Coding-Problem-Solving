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
check(`5 5
1 3
3 2
1 5
5 4
4 2`,
`2`);
check(`6 7
1 3
3 2
1 4
4 2
1 5
5 6
6 2`,
`3`);
check(`7 8
1 3
1 4
3 5
4 5
5 6
5 7
6 2
7 2`,
`2`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, P], ...edges] = input
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
  const f = Array.from({ length: N }, _ => Array(N).fill(0));
  let maxFlowSum = 0;

  while (true) {
    const parents = Array(N).fill(-1);
    const queue = [source];
    queueLoop: for (const node of queue) {
      for (let to = 0; to < N; to++) {
        if (node === to) continue;
        if (
          parents[to] === -1 &&
          c[node][to] - f[node][to] > 0
        ) {
          queue.push(to);
          parents[to] = node;

          if (to === sink) break queueLoop;
        }
      }
    }

    if (parents[sink] === -1) break;

    let maxFlow = Infinity;
    for (let node = sink; node !== source; node = parents[node]) {
      maxFlow = Math.min(maxFlow, c[parents[node]][node] - f[parents[node]][node]);
    }
    if (maxFlow === 0) break;
    maxFlowSum += maxFlow;

    for (let node = sink; node !== source; node = parents[node]) {
      f[parents[node]][node] += maxFlow;
      f[node][parents[node]] -= maxFlow;
    }
  }

  return maxFlowSum;
}

const roads = Array.from({ length: N }, _ => Array(N).fill(0));
for (const [from, to] of edges) {
  roads[from - 1][to - 1]++;
}

// output
return maximumFlow(roads, 0, 1);
}
