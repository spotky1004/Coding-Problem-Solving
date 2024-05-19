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
check(`8 5
1 2
6 1
7 6
8 6
1 3
5 3
4 3`,
`1`);
check(`6 3
1 2
1 3
2 4
2 5
2 6`,
`2`);
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

// code
const adj = Array.from({ length: n }, () => []);
for (const [u, v] of edges) {
  adj[u - 1].push(v - 1);
  adj[v - 1].push(u - 1);
}

const parents = Array(n).fill(-1);
const sizes = Array(n).fill(1);
function initTree(root) {
  parents.fill(-1);
  function impl(u, parent = -1) {
    parents[u] = parent;
    let size = 1;
    for (const v of adj[u]) {
      if (v === parent) continue;
      size += impl(v, u);
    }
    sizes[u] = size;
    return size;
  }
  impl(root);
}

// dp[i][j] (i: vertex, j: min cut edge count when vertex count is _j_; -1 is impossible)
const dp = Array.from({ length: n },() => Array(n + 1).fill(Infinity));
function search(root) {
  initTree(root);

  function impl(u) {
    dp[u].fill(Infinity);
    dp[u][sizes[u]] = 0;

    const curSize = sizes[u];
    const curDp = dp[u];
    for (const v of adj[u]) {
      if (v === parents[u]) continue;
      impl(v);
      const subSize = sizes[v];
      const subDp = dp[v];
      for (let i = 0; i <= curSize; i++) {
        if (i - subSize > 0) curDp[i - subSize] = Math.min(curDp[i - subSize], curDp[i] + 1);
        for (let j = subSize; j >= 0; j--) {
          if (i - subSize + j < 0) break;
          curDp[i - subSize + j] = Math.min(
            curDp[i - subSize + j],
            curDp[i] + subDp[j]
          );
        }
      }
    }
  }
  impl(root);
  
  return dp[root][m];
}

let out = Infinity;
for (let i = 0; i < n; i++) out = Math.min(out, search(i));

// output
return isFinite(out) ? out : -1;
}
