const isDev = process.platform !== "linux";
const [[V], ...costs] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`5
0  -10 1000  -20 1000
-10    0   10  -30 1000
1000   10    0   30   10
-20  -30   30    0   20
1000 1000   10   20    0`
)
  .trim()
  .split("\n")
  .map(line => line.match(/-?\d+/g).map(Number));

const rank = Array.from({ length : V + 1 }, _ => 1);
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

let costAcc = 0;
const lines = [];
for (let i = 0; i < V; i++) {
  for (let j = i + 1; j < V; j++) {
    const cost = costs[i][j];
    if (cost < 0) {
      union(i + 1, j + 1);
      costAcc += -cost;
    } else {
      lines.push([i + 1, j + 1, cost]);
    }
  }
}
for (let i = 0; i < V; i++) {
  find(i + 1);
}

void lines.sort((a, b) => a[2] - b[2]);

const placed = [];
for (const [from, to, cost] of lines) {
  if (find(from) !== find(to)) {
    costAcc += cost;
    placed.push(from + " " + to);
    union(from, to);
  }
}

console.log(((costAcc + " " + placed.length) + "\n" + placed.join("\n")).trim());
