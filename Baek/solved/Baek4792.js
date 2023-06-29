const isDev = process?.platform !== "linux";
const input = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`3 3 2
B 1 2
B 2 3
R 3 1
2 1 1
R 1 2
0 0 0`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(v => v === "B" || v === "R" ? v : Number(v)));

function mst(n, connections) {
  const rank = Array.from({ length : n + 1 }, _ => 1);
  const roots = Array.from({ length : n + 1 }, (_, i) => i);

  function find(a) {
    if (roots[a] === a) return a;

    const root = find(roots[a]);
    roots[a] = root;
    return root;
  }
  function union(a, b){
    a = find(a);
    b = find(b);

    if (a === b) return;

    if (rank[a] < rank[b]) {
      roots[a] = b;
    } else {
      roots[b] = a;
      if (rank[a] === rank[b]) {
        rank[a]++;
      }
    }
  }

  let blueUsed = 0;
  for (const [type, a, b] of connections) {
    if (find(a) !== find(b)) {
      if (type === "B") blueUsed++;
      union(a, b);
    }
  }

  return blueUsed;
}

let line = 0;
const out = [];
while (line < input.length) {
  const [n, m, k] = input[line++];
  if (n === 0) break;
  const connections = input.slice(line, line + m);
  line += m;

  connections.sort((a, b) => a[0] !== "B" ? -1 : 1);
  const minBlue = mst(n, connections);
  connections.sort((a, b) => a[0] === "B" ? -1 : 1);
  const maxBlue = mst(n, connections);

  out.push(minBlue <= k && k <= maxBlue ? 1 : 0);
}
console.log(out.join("\n"));
