const isDev = process.platform !== "linux";
const [, ...rooms] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`2
Az
aZ
`
)
  .trim()
  .split("\n")
  .map(line => Array.from(line).map(v => v === "0" ? Infinity : v.charCodeAt(0) - (v >= "a" ? 96 : 38)));

const V = rooms.length;
const lines = [];
for (let i = 0; i < V; i++) {
  const room = rooms[i];
  for (let j = 0; j < V; j++) {
    const cost = room[j];
    if (!isFinite(cost)) continue;
    lines.push([i + 1, j + 1, cost]);
  }
}

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

const lenSum = rooms.flat().reduce((a, b) => a + (isFinite(b) ? b : 0), 0);
let costAcc = 0;
for (const [from, to, cost] of lines) {
  if (find(from) !== find(to)) {
    costAcc += cost;
    union(from, to);
  }
}

const finds = Array.from({ length: V }, (_, i) => i + 1).map(v => find(v));
if (finds.every(v => v === finds[0]) || V === 1) {
  console.log(lenSum - costAcc);
} else {
  console.log(-1);
}
