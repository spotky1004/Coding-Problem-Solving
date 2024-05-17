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
check(`5 5 100
1 2 20 5
1 3 20 5
1 4 20 5
1 5 20 5
2 3 23 1`,
`1.0625`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, M, F], ...edges] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const rank = Array(N + 1).fill(1);
const roots = Array.from({ length: N + 1 }, (_, i) => i);

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



edges.sort((a, b) => (-a[3] / a[4]) - (-b[3] / b[4]));
function calcEarn(x) {
  rank.fill(1);
  for (let i = 1; i <= N; i++) roots[i] = i;
  
  const subEdges = edges.slice(x);
  let costAcc = 0;
  let timeAcc = 0;
  for (const [i, j, c, t] of subEdges) {
    if (find(i) !== find(j)) {
      costAcc += c;
      timeAcc += t;
      union(i, j);
    }
  }

  for (let i = 1; i <= N; i++) if (find(1) !== find(i)) return -1;
  return (F - costAcc) / timeAcc;
}

let maxEarn = 0;
// let l = 0, r = M;
// while (l + 1 < r) {
//   const m = Math.floor((l + r) / 2);
//   const earn = Math.max(maxEarn, calcEarn(m));
//   maxEarn = Math.max(maxEarn, earn);
//   if (earn === -1) r = m;
//   else if (earn > 0) l = m;
//   else r = m;
// }
for (let i = 0; i < M; i++) {
  maxEarn = Math.max(maxEarn, calcEarn(i));
}

// output
return Math.max(0, Math.floor(maxEarn * 1e4) / 1e4).toFixed(4);
}
