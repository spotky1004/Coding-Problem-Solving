const isDev = process.platform !== "linux";
const [[V, m], ...lines] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`6 5
0 1
1 2
1 3
0 3
4 5
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

  if (a === b) return;

  roots[a] = b;
}

let turnPassed = 0;
let gameEnded = false;
for (const [from, to] of lines) {
  turnPassed++;
  if (find(from) !== find(to)) {
    union(from, to);
  } else {
    gameEnded = true;
    break;
  }
}

console.log(!gameEnded ? 0 : turnPassed);
