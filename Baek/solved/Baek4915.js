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
check(`1 3
adam bob cindy
bob dima edie fairuz gary
1 2
john
paul
george
ringo
1 3
a b c
0 0`,
`1. 2 1 5
2. 4 0 4
3. 0 1 3`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const lines = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(v => !isNaN(parseInt(v)) ? Number(v) : v));

// code
const compState = (a, b) => (a[2] - b[2]) || ((a[0] + a[1]) - (b[0] + b[1]));
const minState = (a, b) => compState(a, b) <= 0 ? a : b;
const addState = (a, b) => a.map((v, i) => v + b[i]);

let line = 0;
const out = [];
let caseNr = 1;
while (true) {
  const [S, F] = lines[line++];
  if (S === 0 && F === 0) break;

  const adj = [];
  const isGrand = [];
  const nameMap = new Map();
  const getNode = name => {
    if (!nameMap.has(name)) {
      nameMap.set(name, nameMap.size);
      adj.push([]);
      isGrand.push(true);
    }
    return nameMap.get(name);
  }
  while (!lines[line].every(v => typeof v === "number")) {
    const [parent, ...children] = lines[line++];
    getNode(parent)
    for (const child of children) {
      adj[getNode(parent)].push(getNode(child));
      isGrand[getNode(child)] = false;
    }
  }

  const dp = Array(adj.length).fill(null);
  const familyDp = Array(adj.length).fill(null);
  function search(u) {
    visited[u] = true;
    for (const v of adj[u]) search(v);

    let single = [1, 0, S];
    for (const v of adj[u]) single = addState(single, dp[v]);
    let family = [0, 1, F];
    for (const v of adj[u]) {
      let subState = [0, 0, 0];
      for (const w of adj[v]) subState = addState(subState, dp[w]);
      family = addState(family, minState(subState, familyDp[v]));
    }

    const out = minState(single, family);
    dp[u] = out;
    familyDp[u] = family;
    // console.log(u, single, family);
    return out;
  }

  let ansState = [0, 0, 0];
  const visited = Array(adj.length).fill(false);
  for (let i = 0; i < visited.length; i++) {
    if (visited[i] || !isGrand[i]) continue;
    ansState = addState(ansState, search(i));
  }

  // console.log(adj.length, ansState, dp[getNode("a")]);
  out.push(`${caseNr++}. ${ansState.join(" ")}`);
}

// output
return out.join("\n");
}
