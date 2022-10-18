const isDev = process.platform !== "linux";
const [[V], ...lines] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`4 2
1 3 2
2 4 3
1 10 1 10
`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const exitCosts = lines.pop();

const rank = Array.from({ length : V + 1 }, _ => 0);
rank[0] = Infinity;
const roots = Array.from({ length: V + 1 }, (_, i) => i);

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



void lines.sort((a, b) => a[2] - b[2]);

let costAcc = 0;
for (const [from, to, cost] of lines) {
  const a = find(from);
  const b = find(to);
  if (
    (a !== 0 || b !== 0) &&
    a !== b
  ) {
    const exitCostA = a !== 0 ? exitCosts[from - 1] : 0;
    const exitCostB = b !== 0 ? exitCosts[to - 1] : 0;
    if (exitCostA <= cost) {
      costAcc += exitCostA;
      union(from, 0);
    }
    if (exitCostB <= cost) {
      costAcc += exitCostB;
      union(to, 0);
    }
    if (find(from) !== 0 || find(to) !== 0) {
      costAcc += cost;
      union(from, to);
    }
  }
}

for (let i = 0; i < V; i++) {
  find(i + 1);
}
const minExitCosts = Array(V + 1).fill(-1);
for (let i = 1; i < roots.length; i++) {
  const root = roots[i];
  if (root === 0) continue;
  if (minExitCosts[root] === -1) minExitCosts[root] = Infinity;
  minExitCosts[root] = Math.min(minExitCosts[root], exitCosts[i - 1]);
}
costAcc += minExitCosts.reduce((a, b) => a + (b === -1 ? 0 : b), 0);

if (isDev) {
  console.log(roots, minExitCosts);
}
console.log(costAcc);
