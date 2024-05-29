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
check(`12
1 2 3
1 3 2
2 4 5
3 5 11
3 6 9
4 7 1
4 8 7
5 9 15
5 10 4
6 11 6
6 12 10`,
`45`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[n], ...edges] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const adj = Array.from({ length: n + 1 }, () => []);
for (const [u, v, w] of edges) {
  adj[u].push([v, w]);
  adj[v].push([u, w]);
}

function search(u = 1, parent = -1) {
  let maxDepth = 0;
  let maxSubLen = 0;
  const subLens = [];
  for (const [v, w] of adj[u]) {
    if (v === parent) continue;
    const [subMaxDepth, subMaxLen] = search(v, u);
    maxDepth = Math.max(maxDepth, subMaxDepth + w);
    maxSubLen = Math.max(maxSubLen, maxDepth, subMaxLen);
    subLens.push(subMaxDepth + w);
  }
  subLens.sort((a, b) => b - a);
  if (subLens.length >= 2) maxSubLen = Math.max(maxSubLen, subLens[0] + subLens[1]);
  return [maxDepth, maxSubLen];
}

// output
return search()[1];
}
