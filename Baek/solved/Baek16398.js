const isDev = process.platform !== "linux";
const [[V], ...costs] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`5
0 6 8 1 3
6 0 5 7 3
8 5 0 9 4
1 7 9 0 6
3 3 4 6 0`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

/** @type {[from: number, to: number, cost: number][]} */
const lines = [];
for (let i = 0; i < V; i++) {
  for (let j = 0; j < i; j++) {
    lines.push([i + 1, j + 1, costs[i][j]]);
  }
}

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

  roots[b] = a;
}



void lines.sort((a, b) => a[2] - b[2]);

let costAcc = 0;
for (const [from, to, cost] of lines) {
  if(find(from) !== find(to)) {
    costAcc += cost;
    union(from, to);
  }
}

console.log(costAcc);
