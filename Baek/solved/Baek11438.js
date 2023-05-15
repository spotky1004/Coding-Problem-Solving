const isDev = process?.platform !== "linux";
const [[N], ...datas] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`15
1 2
1 3
2 4
3 7
6 2
3 8
4 9
2 5
5 11
7 13
10 4
11 15
12 5
14 7
6
6 11
10 9
2 6
7 6
8 13
8 15`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

/**
 * @param {number[]} parents 
*/
function genSparseTable(parents) {
  const sparseTable = [[...parents]];
  
  const tableSize = Math.ceil(Math.log2(parents.length));
  for (let i = 1; i < tableSize; i++) {
    const prevRow = sparseTable[i - 1];
    const row = Array(parents.length);
    row[0] = -1;

    for (let j = 1; j < parents.length; j++) {
      row[j] = prevRow[prevRow[j]] ?? -1;
    }
    sparseTable.push(row);
  }

  return sparseTable;
}

/**
 * @param {number} a 
 * @param {number} b 
 * @param {number} depths 
 * @param {number[][]} sparseTable 
*/
function calcLCA(a, b, depths, sparseTable) {
  if (depths[a] < depths[b]) [a, b] = [b, a];

  a = moveNodeOnSparseTable(a, depths[a] - depths[b], sparseTable);
  let depth = depths[b];

  if (a === b) return a;

  let left = 0;
  let right = depth;
  let mid;
  while (true) {
    mid = Math.floor((left + right) / 2);
    
    const newA = moveNodeOnSparseTable(a, depth - mid, sparseTable);
    const newB = moveNodeOnSparseTable(b, depth - mid, sparseTable);
    if (newA === newB) {
      left = mid;
    } else {
      right = mid;
    }

    if (right - left <= 1) return moveNodeOnSparseTable(a, depth - left, sparseTable);
  }
}

/**
 * @param {number} node 
 * @param {number} count 
 * @param {number[][]} sparseTable 
*/
function moveNodeOnSparseTable(node, count, sparseTable) {
  for (let i = 0; i < sparseTable.length; i++) {
    if ((count & (1 << i)) === 0) continue;
    node = sparseTable[i][node];
  }
  return node;
}



const connections = Array.from({ length: N + 1 }, _ => []);
for (const [a, b] of datas.splice(0, N - 1)) {
  connections[a].push(b);
  connections[b].push(a);
}

const parents = Array(N + 1).fill(-1);
const depths = Array(N + 1).fill(-1);
function init(cur = 1, parent = -1, depth = 1) {
  parents[cur] = parent;
  depths[cur] = depth;

  for (const child of connections[cur]) {
    if (child === parent) continue;
    init(child, cur, depth + 1);
  }
}
init();

const sparseTable = genSparseTable(parents);

const [M] = datas.shift();
const out = [];
for (const [a, b] of datas) {
  out.push(calcLCA(a, b, depths, sparseTable));
}

console.log(out.join("\n"));
