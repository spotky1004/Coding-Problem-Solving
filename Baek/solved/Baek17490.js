const isDev = process.platform !== "linux";
const [[V, m, K], s, ...notConnected] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`5 3 8
1 2 3 4 5
3 4
1 2
2 3`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

if (m <= 1) {
  console.log("YES");
  process.exit(0);
}

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

const connected = Array(V + 1).fill(true);
for (const [from, to] of notConnected) {
  const a = Math.min(from, to);
  const b = Math.max(from, to);
  if (a === 1 && b === V) {
    connected[b] = false;
  } else {
    if (b - a !== 1) continue; // :thonk:
    connected[a] = false;
  }
}
for (let i = 1; i < connected.length; i++) {
  if (!connected[i]) continue;
  if (i === V) {
    union(i, 1);
  } else {
    union(i, i + 1);
  }
}
for (let i = 1; i <= V; i++) {
  find(i);
}

const costBundles = Array.from({ length: V + 1 }, _ => []);
for (let i = 1; i < roots.length; i++) {
  costBundles[roots[i]].push(s[i - 1]);
}
const costAcc = costBundles.reduce((a, b) => a + (b.length > 0 ? Math.min(...b) : 0), 0);
if (isDev) {
  console.log(costBundles, costAcc, roots);
}

console.log(costAcc <= K ? "YES" : "NO");
