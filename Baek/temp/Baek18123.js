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
check(`3
4
0 1
1 2
2 3
4
0 2
2 3
3 1
4
0 1
1 2
1 3`,
`2`);

const caseSize = 10000;
let bigTestCase;

bigTestCase = `${caseSize}\n` + Array(caseSize).fill(`2
0 1`).join("\n");
check(bigTestCase, `1`);

bigTestCase = `${caseSize}\n` + Array(caseSize).fill(`24
0 1
1 5
1 6
1 7
0 2
2 12
2 8
0 3
3 9
3 10
0 4
4 13
4 11
17 6
6 16
15 6
6 14
19 9
18 9
20 9
10 21
10 22
10 23`).join("\n");
check(bigTestCase, `1`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[n], ...stars] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const starComps = [];
/**
 * @param {number[][]} star (adj list)
 * @param {number} root 
 */
function compressStar(star, root) {
  let comp = "";
  const queue = [root];
  const visited = Array(star.length).fill(false);
  visited[root] = true;
  for (const node of queue) {
    let childCount = 0;
    for (const child of star[node]) {
      if (visited[child]) continue;
      visited[child] = true;
      childCount++;
      queue.push(child);
    }
    comp += childCount.toString(36);
  }
  return comp;
}

let line = 0;
while (line < stars.length) {
  const [s] = stars[line++];
  const adjList = Array.from({ length: s }, _ => []);
  for (let i = 0; i < s - 1; i++) {
    const [u, v] = stars[line++];
    adjList[u].push(v);
    adjList[v].push(u);
  }
  const compresses = [];
  for (let i = 0; i < s; i++) {
    compresses.push(compressStar(adjList, i));
  }
  compresses.sort();
  // console.log(compresses);
  starComps.push(compresses[0]);
}

// console.log(starComps);

// output
return (new Set(starComps)).size;
}
