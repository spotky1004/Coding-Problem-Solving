const isDev = process.platform !== "linux";
const [[V], G, ...lines] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`5 7
M W W W M
1 2 12
1 3 10
4 2 5
5 2 5
2 5 10
3 4 3
5 4 7
`
)
  .trim()
  .split("\n")
  .map((line, i) => line.split(" ").map(v => i !== 1 ? Number(v) : v));

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
  if (G[from - 1] !== G[to - 1] && find(from) !== find(to)) {
    costAcc += cost;
    union(from, to);
  }
}

const finds = Array.from({ length: V }, (_, i) => i + 1).map(v => find(v));
if (finds.every(v => v === finds[0])) {
  console.log(costAcc);
} else {
  console.log(-1);
}
