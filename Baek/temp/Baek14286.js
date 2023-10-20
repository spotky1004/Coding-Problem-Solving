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
check(`8 9
1 2 3
1 3 2
1 4 4
2 5 2
3 6 1
4 7 3
5 8 6
6 8 2
7 8 7
1 8`,
`6`);
check(`8 9
2 1 3
3 1 2
4 1 4
5 2 2
6 3 1
7 4 3
8 5 6
8 6 2
8 7 7
1 8`,
`6`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[n, m], ...edges] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));
const [s, t] = edges.pop();

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



const capacity = Array.from({ length: n }, _ => Array(n).fill(0));
for (const [a, b, c] of edges) {
  capacity[a - 1][b - 1] = c;
  capacity[b - 1][a - 1] = c;
}

// output
return maximumFlow(capacity, s - 1, t - 1);
}
