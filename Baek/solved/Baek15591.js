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
check(`4 3
1 2 3
2 3 2
2 4 4
1 2
4 1
3 1`,
`3
0
2`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, Q], ...lines] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));
const edges = lines.splice(0, N - 1);
const queries = lines;

// code
const adj = Array.from({ length: N + 1 }, _ => []);
for (const [p, q, r] of edges) {
  adj[p].push([q, r]);
  adj[q].push([p, r]);
}

const out = [];
for (const [k, v] of queries) {
  const usado = Array(N + 1).fill(Infinity);
  usado[0] = -Infinity;
  usado[v] = 1e100;
  const queue = [v];
  for (const u of queue) {
    for (const [v, r] of adj[u]) {
      if (isFinite(usado[v])) continue;
      usado[v] = Math.min(usado[u], r);
      queue.push(v);
    }
  }
  usado[v] = -Infinity;
  out.push(usado.reduce((a, b) => a + (b >= k), 0));
}

// output
return out.join("\n");
}
