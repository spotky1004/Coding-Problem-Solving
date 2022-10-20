const isDev = process.platform !== "linux";
const [[V], ...poses] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`5
11 -15 -15
14 -5 -15
-1 -1 -5
10 -4 -1
19 -4 19`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

poses.map((v, i) => v.push(i + 1));
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
function addLines() {
  for (let i = 1; i < poses.length; i++) {
    const [xa, ya, za, a] = poses[i - 1];
    const [xb, yb, zb, b] = poses[i];
    lines.push([a, b, Math.min(Math.abs(xa - xb), Math.abs(ya - yb), Math.abs(za - zb))]);
  }
}
void poses.sort((a, b) => a[0] - b[0]);
addLines();
void poses.sort((a, b) => a[1] - b[1]);
addLines();
void poses.sort((a, b) => a[2] - b[2]);
addLines();
void lines.sort((a, b) => a[2] - b[2]);

let costAcc = 0;
for (const [from, to, cost] of lines) {
  if (find(from) !== find(to)) {
    costAcc += cost;
    union(from, to);
  }
}

console.log(costAcc);
