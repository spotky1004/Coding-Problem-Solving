const isDev = process.platform !== "linux";
const [[V], ...lines] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`7 12
1 2 3
1 3 2
3 2 1
2 5 2
3 4 4
7 3 6
5 1 5
1 6 2
6 4 1
6 5 3
4 5 3
6 7 4
`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

void lines.sort((a, b) => a[2] - b[2]);

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

let costAcc = 0;
let maxCost = 0;
for (const [from, to, cost] of lines) {
  if(find(from) !== find(to)) {
    costAcc += cost;
    maxCost = Math.max(maxCost, cost);
    union(from, to);
  }
}

console.log(costAcc - maxCost);
