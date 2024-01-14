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
check(`6 6 12
3 2 1 7 100 0
1 2 1
2 3 4
3 1 9
3 4 10
4 5 100
6 1 0`,
`4 36`);
check(`2 1 2
1000000000000000000 1
1 2 1000000000000000000`,
`2 50`)
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, M, K], A, ...edges] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(BigInt));

// code
let B = [];
/** @type {[vi: number, Bi: bigint][]} */
const adj = Array.from({ length: Number(N) }, _ => []);
for (const [ui, vi, Bi] of edges) {
  B.push(Bi);
  adj[Number(ui) - 1].push([Number(vi) - 1, Bi]);
}
B = [...new Set(B.sort((a, b) => Number(a - b)))];
adj.map(e => e.sort((a, b) => Number(a[1] - b[1])));

const logMax = Math.ceil(Math.log2(1e18));
let u = 0;
let c = 0n;

function genSparseTable() {
  const move = [];
  for (let i = 0; i < N; i++) {
    const edges = adj[i];
    let l = -1, r = edges.length;
    while (l + 1 < r) {
      const m = Math.floor((l + r) / 2);
      if (edges[m][1] <= c) l = m;
      else r = m;
    }
    const nextNode = (edges[l] ?? [])[0];
    move.push(typeof nextNode !== "undefined" ? [nextNode, A[nextNode]] : [i, A[i]]);
  }

  const table = [move];
  for (let i = 1; i <= logMax; i++) {
    const prev = table[i - 1];
    const row = [];
    table.push(row);
    for (let j = 0; j < N; j++) {
      const prevCost = prev[j][1];
      const nextNode = prev[prev[j][0]];
      row.push([nextNode[0], prevCost + nextNode[1]]);
    }
  }

  return table;
}

function tableMove(k) {
  let newU = u;
  let cAdd = 0n;
  let i = 0;
  let b = 1n;

  while (b <= k) {
    if ((k & b) !== 0n) {
      const next = table[i][newU];
      newU = next[0];
      cAdd += next[1];
    }

    i++;
    b *= 2n;
  }

  return [newU, cAdd];
}

let table = genSparseTable();
let tableGenAt = c;
let nextBIdx = 0;
let loopLeft = K;
while (loopLeft > 0n) {
  while (tableGenAt >= B[nextBIdx]) nextBIdx++;

  const cDiff = (B[nextBIdx] ?? 10n**50n) - tableGenAt;
  let l = 0n, r = loopLeft + 1n;
  while (l + 1n < r) {
    const m = (l + r) / 2n;
    const result = tableMove(m);
    if (result[1] < cDiff) l = m;
    else r = m;
  }
  if (l !== loopLeft) l++;

  const [newU, cAdd] = tableMove(l);
  u = newU;
  c += cAdd;
  loopLeft -= l;
  table = genSparseTable();
  tableGenAt = c;
}

const mod = 1_000_000_007n;

// output
return `${1 + u} ${c % mod}`;
}
