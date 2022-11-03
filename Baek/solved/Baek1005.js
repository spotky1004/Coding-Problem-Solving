const isDev = process.platform !== "linux";
const input = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`2
4 4
10 1 100 10
1 2
1 3
2 4
3 4
4
8 8
10 20 1 5 8 7 1 43
1 2
1 3
2 4
2 5
3 6
5 7
6 7
7 8
7
`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

class Node {
  t
  /** @type {number} */
  n
  /** @type {Node[]} */
  parents = [];
  /** @type {Node[]} */
  childs = [];

  constructor(n, t) {
    this.n = n;
    this.t = t;
  }
  
  addParent(parent) {
    if (this.parents.includes(parent)) return;
    this.parents.push(parent);
  }

  removeParent(parent) {
    const idx = this.parents.findIndex(n => n === parent);
    if (idx === -1) return;
    this.parents.splice(idx, 1);
  }

  addChild(child) {
    if (this.childs.includes(child)) return;
    this.childs.push(child);
  }
}

let i = 1;
while (i < input.length) {
  const [V, K] = input[i];
  i++;
  const D = input[i];
  i++;
  const rules = input.slice(i, i + K);
  i += K;
  const [W] = input[i];
  i++;

  const nodes = Array.from({ length: V + 1 }, (_, i) => new Node(i, D[i - 1]));
  for (const [X, Y] of rules) {
    const a = nodes[X];
    const b = nodes[Y];
    b.addParent(a);
    a.addChild(b);
  }
  nodes.shift();
  
  let t = 0;
  while (nodes.length > 0) {
    const canBuilds = nodes.filter(v => v && v.parents.length === 0).sort((a, b) => a.t - b.t);
    const tAcc = canBuilds[0].t;
    t += tAcc;
    canBuilds.forEach(n => n.t -= tAcc);
    const toRemove = canBuilds[0];
    const n = toRemove.n;
    if (n === W) {
      break;
    }
    toRemove.childs.forEach(n => n.removeParent(toRemove));
    nodes[n - 1] = null;
  }
  console.log(t);
}
