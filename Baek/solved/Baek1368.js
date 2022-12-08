const isDev = process.platform !== "linux";
const [[V], ...data] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`4
5
4
4
3
0 2 2 2
2 0 3 3
2 3 0 4
2 3 4 0`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

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

/** @type {[from: number, to: number, cost: number]} */
const lines = [];
for (let i = 0; i < V; i++) {
  lines.push([0, i + 1, data[i][0]]);
}
for (let i = V; i < data.length; i++) {
  const row = data[i];
  for (let j = 0; j < i - V; j++) {
    lines.push([i - V + 1, j + 1, row[j]]);
  }
}

void lines.sort((a, b) => a[2] - b[2]);

let costAcc = 0;
for (const [from, to, cost] of lines) {
  if (find(from) !== find(to)) {
    costAcc += cost;
    union(from, to);
  }
}

console.log(costAcc);
