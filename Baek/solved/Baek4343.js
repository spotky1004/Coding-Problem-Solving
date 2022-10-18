const isDev = process.platform !== "linux";
const input = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`1
4 4
0 100
0 300
0 600
150 750
`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

let i = 1;
while (i < input.length) {
  const [S, V] = input[i];
  i++;
  const poses = input.slice(i, i + V);
  i += V;

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
  
  const lines = [];
  for (let a = 1; a < poses.length + 1; a++) {
    const [xa, ya] = poses[a - 1];
    for (let b = 1; b < poses.length + 1; b++) {
      if (a === b) continue;
      const [xb, yb] = poses[b - 1];
      lines.push([a, b, Math.sqrt(Math.abs(xa - xb)**2 + Math.abs(ya - yb)**2)]);
    }
  }
  void lines.sort((a, b) => a[2] - b[2]);
  
  let costs = [];
  for (const [from, to, cost] of lines) {
    if (find(from) !== find(to)) {
      costs.push(cost);
      union(from, to);
    }
  }
  void costs.sort((a, b) => b - a);

  console.log((costs.slice(Math.max(0, S - 1))[0] ?? 0).toFixed(2));
}
