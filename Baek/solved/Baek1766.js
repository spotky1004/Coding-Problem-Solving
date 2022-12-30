const isDev = process?.platform !== "linux";
const [[V, M], ...datas] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`4 2
1 4
3 2`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

class Node {
  /** @type {number} */
  n
  /** @type {Node[]} */
  parents = [];
  /** @type {Node[]} */
  childs = [];

  constructor(n) {
    this.n = n;
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

const nodes = Array.from({ length: V + 1 }, (_, i) => new Node(i));
for (const [from, to] of datas) {
  const b = nodes[from];
  const a = nodes[to];
  a.addParent(b);
  b.addChild(a);
}
nodes.shift();

const order = [];
let i = 1;
while (order.length < nodes.length) {
  if (i > V) {
    i = 1;
  }
  const node = nodes[i - 1];
  if (!node || node.parents.length !== 0) {
    i++;
    continue;
  }
  order.push(i);
  node.childs.forEach(n => n.removeParent(node));
  const removeableChilds = node.childs.filter(n => n.parents.length === 0);
  const nextI = removeableChilds.map(v => v.n).sort((a, b) => a - b)[0] ?? Infinity;
  nodes[i - 1] = null;
  if (nextI < i) {
    i = nextI;
  }
}

console.log(order.join(" "));
