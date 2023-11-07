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
check(`4 4
1 2
3 4
2 3
1 4`,
`5
6
10
10`);
check(`9 6
1 2
2 3
6 7
4 9
3 4
2 8`,
`10
12
13
14
20
25`);
check(`200000 300000\n` + `100000 100001\n`.repeat(300000), `200001\n`.repeat(300000).trim());
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, M], ...items] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const rank = Array.from({ length : N + 1 }, _ => 1);
const roots = Array.from({ length: N + 1 }, (_, i) => i);
const groupSize = Array(N + 1).fill(1);
groupSize[0] = 0;

/**
 * @param {number} a 
*/
function find(a) {
  if (roots[a] === a) return a;

  const root = find(roots[a]);
  roots[a] = root;
  return root;
}

/**
 * @param {number} a 
 * @param {number} b 
*/
function union(a, b){
  a = find(a);
  b = find(b);

  if (a === b) return;

  if (rank[a] < rank[b]) {
    roots[a] = b;
  } else {
    roots[b] = a;
    if (rank[a] === rank[b]) {
      rank[a]++;
    }
  }
}



function sum(n) {
  return n * (n + 1) / 2;
}

const out = [];
let slimeCount = N;
for (const [a, b] of items) {
  const aGroup = find(a);
  const bGroup = find(b);
  if (aGroup !== bGroup) {
    const aGroupSize = groupSize[aGroup];
    const bGroupSize = groupSize[bGroup];
    union(a, b);
    const unionGroup = find(a);
    const unionGroupSize = aGroupSize + bGroupSize;
    groupSize[unionGroup] = unionGroupSize;
    slimeCount += sum(unionGroupSize - 1) - sum(aGroupSize - 1) - sum(bGroupSize - 1);
  }
  out.push(slimeCount);
}

// output
return out.join("\n");
}
