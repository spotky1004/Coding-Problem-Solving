const isDev = process.platform !== "linux";
const [[V], ...poses] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`3
1.0 1.0
2.0 2.0
2.0 4.0
`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

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

const lines = [];
for (let a = 1; a < poses.length + 1; a++) {
  const [xa, ya] = poses[a - 1];
  for (let b = 1; b < poses.length + 1; b++) {
    const [xb, yb] = poses[b - 1];
    lines.push([a, b, Math.sqrt(Math.abs(xa - xb)**2 + Math.abs(ya - yb)**2)]);
  }
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
