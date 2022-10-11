const isDev = process.platform !== "linux";
const [[V], , ...connected] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`3
3
0 1 0
1 0 1
0 1 0
1 2 3
`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const plan = connected.pop();

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

for (let i = 0; i < V; i++) {
  for (let j = i; j < V; j++) {
    if (connected[i][j] === 1) union(i + 1, j + 1);
  }
}

const finds = plan.map(v => find(v));
console.log(finds.every(v => v === finds[0]) ? "YES": "NO");
