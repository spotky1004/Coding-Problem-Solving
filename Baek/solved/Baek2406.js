const isDev = process.platform !== "linux";
const [[V, m], ...datas] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`5 2
2 3
4 5
0 100 50 100 100
100 0 100 100 20
50 100 0 20 100
100 100 20 0 80
100 20 100 80 0
`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const connected = datas.splice(0, m);
const costs = datas;

const roots = Array.from({ length: V + 1 }, (_, i) => i);
const isolated = Array.from({ length: V + 1 }, _ => true);

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

for (const [from, to] of connected) {
  if (
    from === 1 ||
    to === 1 ||
    find(from) === find(to)
  ) continue;
  union(from, to);
}
isolated[0] = false;
isolated[1] = false;
for (let i = 2; i < roots.length; i++) {
  const val = roots[i];
  if (val === i) continue;
  isolated[i] = false;
  isolated[val] = false;
}

const lines = [];
for (let i = 2; i < V + 1; i++) {
  const costLine = costs[i - 1];
  for (let j = 2; j < V + 1; j++) {
    if (i === j) continue;
    lines.push([i, j, costLine[j - 1]]);
  }
}

void lines.sort((a, b) => a[2] - b[2]);

let costAcc = 0;
const extraConnected = [];
for (const [from, to, cost] of lines) {
  if (find(from) !== find(to)) {
    costAcc += cost;
    extraConnected.push(from + " " + to);
    union(from, to);
  }
}

console.log((costAcc + " " + extraConnected.length + "\n" + extraConnected.join("\n")).trim());
