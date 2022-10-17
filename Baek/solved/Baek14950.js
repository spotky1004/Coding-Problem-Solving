const isDev = process.platform !== "linux";
const [[V, , t], ...lines] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`4 5 8
1 2 3
1 3 2
2 3 2
2 4 4
3 4 1
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



void lines.sort((a, b) => a[2] - b[2]);

let costAcc = 0;
for (const [from, to, cost] of lines) {
  if (find(from) !== find(to)) {
    costAcc += cost;
    union(from, to);
  }
}

console.log(costAcc + t*(V-1)*(V-2)/2);
