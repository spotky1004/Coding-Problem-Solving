const isDev = process.platform !== "linux";
const [[V], ...lines] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`3 3
1 2 1
2 3 2
1 3 3
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
for (const [from, to, cost] of lines) {
  if(find(from) !== find(to)) {
    costAcc += cost;
    union(from, to);
  }
}

console.log(costAcc);
