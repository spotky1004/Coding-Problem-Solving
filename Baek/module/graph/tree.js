class Node {
  /** @type {number} */
  idx
  /** @type {Node[]} */
  connections = [];
  /** @type {Node[]} */
  parents = [];
  /** @type {Node[]} */
  childs = [];

  constructor(n) {
    this.idx = n;
  }

  /**
   * @param {Node} node 
   */
  addConnection(node) {
    if (this.connections.includes(node)) return;
    this.connections.push(node);
  }

  /**
   * @param {number} depth 
   */
  setDepth(depth = 1) {
    this.depth = depth;

    if (depth === 1 && this.parents.length !== 0) this.parents = [];
    if (this.childs.length !== 0) this.childs = [];

    for (const node of this.connections) {
      if (this.parents.includes(node)) continue;
      this.childs.push(node);
      node.parents.push(this);
      node.setDepth(depth + 1);
    }
  }

  getBottomNodes(bottomNodes = []) {
    if (this.childs.length === 0) {
      bottomNodes.push(this);
      return bottomNodes;
    }

    for (const node of this.childs) {
      node.getBottomNodes(bottomNodes);
    }
    return bottomNodes;
  }
}

const nodes = Array.from({ length: V + 1 }, (_, i) => new Node(i));
for (const [from, to] of lines) {
  const a = nodes[from];
  const b = nodes[to];
  a.addConnection(b);
  b.addConnection(a);
}

nodes[1].setDepth();
