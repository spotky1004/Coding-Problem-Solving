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
check(`6 6
1 1 2 2 5
6 1 2 3 4 5 6
3 2 5 6
1 3
3 1 2 3
3 4 5 6
4 2 3 4 5
`,
`1
2
1
3
2
3`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, Q], parents, ...queries] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
parents.unshift(0, 0);
const childs = Array.from({ length: N + 1 }, _ => []);
for (let i = 2; i <= N; i++) {
  const parent = parents[i];
  childs[parent].push(i);
}

const depths = Array(N + 1).fill(0);
function dfs(curNode = 1, depth = 0) {
  depths[curNode] = depth;
  for (const child of childs[curNode]) {
    dfs(child, depth + 1);
  }
}
dfs();

const existCheck = Array(N + 1).fill(-1);
const out = [];
for (let i = 0; i < Q; i++) {
  const upNodes = queries[i].slice(1).sort((a, b) => depths[a] - depths[b]);
  for (const node of upNodes) {
    existCheck[node] = i;
  }

  let pressCount = 0;
  for (let j = 0; j < upNodes.length; j++) {
    const node = upNodes[j];
    if (existCheck[parents[node]] !== i) pressCount++;
    else pressCount--;
    pressCount += childs[node].length;
  }
  out.push(pressCount);
}


// output
return out.join("\n");
}
