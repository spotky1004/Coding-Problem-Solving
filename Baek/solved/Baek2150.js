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
check(`7 9
1 4
4 5
5 1
1 6
6 7
2 7
7 3
3 7
7 2`,
`3
1 4 5 -1
2 3 7 -1
6 -1`);
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
 * @param {number[][]} adj 
*/
function SCC(adj) {
  adj.forEach(v => v.sort((a, b) => a - b));
  let nextId = 0;
  const ids = Array(adj.length).fill(-1);
  const isFin = Array(adj.length).fill(false);

  const stack = [];
  const out = [];
  /**
   * @param {number} u 
   */
  function impl(u) {
    const curId = nextId++;
    ids[u] = curId;
    stack.push(u);

    for (const v of adj[u]) {
      if (isFin[v] || u === v) continue;
      if (ids[v] === -1) {
        const result = impl(v);
        if (result !== -1) ids[u] = Math.min(ids[u], ids[v]);
      } else ids[u] = Math.min(ids[u], ids[v]);
    }

    if (ids[u] !== curId) return ids[u];

    const scc = [];
    out.push(scc);
    while (scc[scc.length - 1] !== u) {
      const sccNode = stack.pop();
      isFin[sccNode] = true;
      scc.push(sccNode);
    }
    scc.sort((a, b) => a - b);
  }

  for (let i = 0; i < adj.length; i++) {
    if (isFin[i]) continue;
    impl(i);
  }

  out.sort((a, b) => a[0] - b[0]);
  return out;
}



const adj = Array.from({ length: V + 1 }, () => []);
for (const [u, v] of edges) adj[u].push(v);
const out = SCC(adj);
out.shift();
out.forEach(scc => scc.push(-1));
out.unshift([out.length]);

// output
return out.map(scc => scc.join(" ")).join("\n");
}
