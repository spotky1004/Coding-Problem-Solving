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
for (const [from, to] of lines) {
  const a = nodes[from];
  const b = nodes[to];
  a.addParent(b);
  b.addChild(a);
}
nodes.shift();

while (nodes.length > 0) {
  const idx = nodes.findIndex(v => v && v.parents.length === 0);
  const toRemove = nodes[idx];
  if (!toRemove) break;
  toRemove.childs.forEach(n => n.removeParent(toRemove));
  nodes[idx] = null;
}
