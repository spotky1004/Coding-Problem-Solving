const isDev = process.platform !== "linux";
const [G, V, ...planes] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`4
6
2
2
3
3
4
4`
)
  .trim()
  .split("\n")
  .map(Number);

const rank = Array.from({ length : V + 1 }, (_, i) => V - i);
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

let dockedCount = 0;
for (const g of planes) {
  const root = find(g);
  if (root === 0) break;
  dockedCount++;
  union(root, root - 1);
}

console.log(dockedCount);
