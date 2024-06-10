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
check(`3 4
1 2 1
3 2 1
1 3 5
2 3 2`,
`3`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[V, E], ...edges] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
/**
 * @param {number} V 
 * @param {[a: number, b: number, cost: number]} edges 
 * @returns {number[][]} 
*/
function floydWarshall(V, edges) {
  const costs = Array.from({ length: V }, _ => Array(V).fill(Infinity));
  for (let i = 0; i < V; i++) costs[i][i] = 0;
  for (const [u, v, cost] of edges) costs[u][v] = cost;

  for (let k = 0; k < V; k++) {
    for (let u = 0; u < V; u++) {
      for (let v = 0; v < V; v++) costs[u][v] = Math.min(costs[u][v], costs[u][k] + costs[k][v]);
    }
  }
  return costs;
}



const d = floydWarshall(V, edges.map(v => [v[0] - 1, v[1] - 1, v[2]]));
let minLoop = Infinity;
for (let i = 0; i < V; i++) {
  for (let j = 0; j < V; j++) {
    if (i === j) continue;
    minLoop = Math.min(minLoop, d[i][j] + d[j][i]);
  }
}

// output
return isFinite(minLoop) ? minLoop : -1;
}
