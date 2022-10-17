const isDev = process.platform !== "linux";
const [[V], ...lines] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`4 5
0 1 1
1 2 0
1 4 0
4 2 1
3 4 1
2 3 0
`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

let roots = Array.from({ length: V + 1 }, (_, i) => i);

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



void lines.sort((a, b) => b[2] - a[2]);

let bestAcc = 0;
for (const [from, to, cost] of lines) {
  if (find(from) !== find(to)) {
    bestAcc += cost^1;
    union(from, to);
  }
}

roots = Array.from({ length: V + 1 }, (_, i) => i);
lines.reverse();
let worstAcc = 0;
for (const [from, to, cost] of lines) {
  if (find(from) !== find(to)) {
    worstAcc += cost^1;
    union(from, to);
  }
}

console.log(worstAcc**2 - bestAcc**2);
