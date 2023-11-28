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
check(`4 5 10
1 2 0 5
1 3 7 9
1 4 1 6
2 4 3 4
3 4 2 2`,
[`YES
5
7
4
4
2`, `YES
4
9
4
4
2`, `YES
4
9
6
4
2`]);
check(`4 5 12
1 2 0 5
1 3 7 9
1 4 1 6
2 4 3 4
3 4 2 2`,
`NO`);
check(`2 1 234
2 1 0 123123124`,
`YES
234`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, M, K], ...edges] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const rank = Array.from({ length: N + 1 }, _ => 1);
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



const sortedEdges = edges
  .map((v, i) => [i, ...v])
  .sort((a, b) => {
    const rDiff = a[4] - b[4];
    if (rDiff !== 0) return rDiff;
    const lDiff = a[3] - b[3];
    return lDiff;
  });
const selectedEdgeIdxes = [];
const vertexMins = Array(N + 1).fill(Infinity);
const out = Array(M).fill(-1);
let sum = 0;
for (const [idx, u, v, l, r] of sortedEdges) {
  if (find(u) === find(v)) {
    vertexMins[u] = Math.min(vertexMins[u], r);
    vertexMins[v] = Math.min(vertexMins[v], r);
    out[idx] = r;
    continue;
  }

  union(u, v);
  sum += l;
  out[idx] = l;
  selectedEdgeIdxes.push(idx);
}

if (sum > K) return "NO";
let left = K - sum;
for (const idx of selectedEdgeIdxes) {
  const [u, v, l, r] = edges[idx];
  const add = Math.max(0, Math.min(left, Math.min(r, vertexMins[u], vertexMins[v]) - l));
  out[idx] += add;
  left -= add;
  sum += add;
}
if (sum < K) return "NO";

// output
return `YES\n${out.join("\n")}`;
}
