const isDev = process.platform !== "linux";
const [[V], ...costs] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`5
5 14 3 7
13 2 6
11 7
4
`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const lines = [];
for (let i = 0; i < V; i++) {
  for (let j = i + 1; j < V; j++) {
    lines.push([i + 1, j + 1, costs[i][j - i - 1]]);
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

const connected = Array.from({ length: V + 1 }, _ => []);
for (const [from, to] of lines) {
  if (find(from) !== find(to)) {
    connected[from].push(to);
    connected[to].push(from);
    union(from, to);
  }
}

console.log(connected.slice(1).map(v => v.length + " " + v.sort((a, b) => a - b).join(" ")).join("\n"));
