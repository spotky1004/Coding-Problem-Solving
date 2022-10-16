const isDev = process.platform !== "linux";
const [[V], genNums, ...lines] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`9 14 3
1 2 9
1 3 3
1 4 8
2 4 10
3 4 11
3 5 6
4 5 4
4 6 10
5 6 5
5 7 4
6 7 7
6 8 4
7 8 5
7 9 2
8 9 5`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const gens = Array.from({ length: V + 1 }, (_, i) => genNums.includes(i) ? true : false);
const roots = Array.from({ length: V + 1 }, (_, i) => i);

function changeAllRoots(from, to) {
  for (let i = 0; i < roots.length; i++) {
    if (roots[i] === from) {
      roots[i] = to;
    }
  }
}

/**
 * @param {number} a 
*/
function find(a) {
  if (roots[a] === a) return a;

  const root = find(roots[a]);
  if (gens[a]) {
    changeAllRoots(root, a);
    roots[root] = a;
    return root;
  } else {
    changeAllRoots(a, root);
    roots[a] = root;
    return roots[a];
  }
}

/**
 * @param {number} a 
 * @param {number} b 
*/
function union(a, b){
  a = find(a);
  b = find(b);

  if (gens[a]) {
    changeAllRoots(b, a);
    roots[b] = a;
  } else {
    changeAllRoots(a, b);
    roots[a] = b;
  }
}



void lines.sort((a, b) => a[2] - b[2]);

let costAcc = 0;
for (const [from, to, cost] of lines) {
  const a = find(from);
  const b = find(to);

  if (
    (!gens[a] || !gens[b]) &&
    find(from) !== find(to)
  ) {
    costAcc += cost;
    union(from, to);
  }
}

console.log(costAcc);
