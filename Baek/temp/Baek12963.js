const isDev = typeof window !== "undefined" || require("os").userInfo().username === "spotky";

if (!isDev) {
  const input = require("fs").readFileSync("/dev/stdin").toString();
  const out = solve(input);
  console.log(out);
} else {
  let CASE_NR = 0;
  function check(input, answer) {
    CASE_NR++;
    const startTime = new Date().getTime();
    const out = solve(input);
    const deltaStr = (new Date().getTime() - startTime).toString();
    const deltaZeroStr = " "+"0".repeat(6 - deltaStr.length);
    if (out.toString() === answer) console.log("\x1b[1m%s\x1b[42m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[40m", `Case ${CASE_NR}: `, ` AC `, deltaZeroStr, deltaStr+"ms");
    else console.log("\x1b[1m%s\x1b[41m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[31m%s\x1b[0m", `Case ${CASE_NR}: `, ` WA `, deltaZeroStr, deltaStr+"ms\n", out);
  }

// cases
check(`3 2
0 1
1 2`,
`1`);
check(`4 4
0 1
1 3
0 2
2 3`,
`10`);
check(`3 1
0 1`,
`0`);
check(`5 0`,
`0`);
check(`6 9
1 3
1 2
2 3
0 1
4 5
3 5
0 2
1 4
4 3`,
`39`);
}

function solve(input) {
// input
const [[N, M], ...edges] = input
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const p = 1_000_000_007n;

const rank = Array.from({ length : N }, _ => 1);
const roots = Array.from({ length: N }, (_, i) => i);

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

/**
 * @param {BigInt} a 
 * @param {BigInt} b 
 * @param {BigInt} p
*/
function divAndPow(a, b, p) {
  if (b === 0n) return 1n;
  let out = 1n;
  let curMul = a;
  const loopCount = BigInt(Math.ceil(Math.log2(Number(b))) + 1);
  for (let i = 0n; i < loopCount; i++) {
    if (b & 1n << i) {
      out = out*curMul % p;
    }
    curMul = curMul**2n % p;
  }
  return out;
}

/**
 * @param {bigint} a 
 * @param {bigint} b 
 */
function min(a, b) {
  if (a < b) return a;
  return b;
}



/** @type {bigint[]} */
const peoples = Array(N).fill(0n);
/** @type {[from: number, to: number, weight: bigint][]} */
const edgesToWatch = [];

for (let i = M - 1; i >= 0; i--) {
  const [from, to] = edges[i];
  const weight = divAndPow(3n, BigInt(i), p);

  if (from === 0 || to === 0) {
    peoples[Math.max(from, to)] = weight;
    continue;
  }
  if (find(from) !== find(to)) {
    union(from, to);
    edgesToWatch.push([from, to, weight]);
  }
}

const connections = Array.from({ length: N }, _ => []);
for (const [from, to, weight] of edgesToWatch) {
  connections[from].push([to, weight]);
  connections[to].push([from, weight]);
}

const depths = Array(N).fill(-1);
const parents = Array(N).fill(-1);
const weights = Array(N).fill(0n);
function init(curNode = N - 1, depth = 0) {
  depths[curNode] = depth;
  for (const [childNode, weight] of connections[curNode]) {
    if (depths[childNode] !== -1) continue;
    parents[childNode] = curNode;
    weights[childNode] = weight;
    init(childNode, depth + 1);
  }
}
init();

const queue = depths.map((v, i) => [v, i]).sort((a, b) => b[0] - a[0]).map(v => v[1]);
for (const node of queue) {
  if (parents[node] === -1) continue;
  peoples[parents[node]] += min(peoples[node], weights[node]);
}

// output
return peoples[N - 1] + "";
}
