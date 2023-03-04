const isDev = process?.platform !== "linux";
const [[N], ...datas] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`15
1 2
1 3
2 4
3 7
6 2
3 8
4 9
2 5
5 11
7 13
10 4
11 15
12 5
14 7
6
6 11
10 9
2 6
7 6
8 13
8 15`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

class Node {
  idx = -1;
  /** @type {Node[]} */
  childs = [];
  /** @type {Node?} */
  parent = null;
  depth = -1;

  /**
   * @param {number} idx 
   */
  constructor(idx) {
    this.idx = idx;
  }

  /**
   * @param {Node} node 
   */
  addChild(node) {
    node.parent = this;
    this.childs.push(node);
  }

  /**
   * @param {number} depth 
   */
  setDepth(depth) {
    this.depth = depth;
    for (const child of this.childs) {
      child.setDepth(depth + 1);
    }
  }
}

const nodes = Array.from({ length: N + 1 }, (_, i) => new Node(i));

const edges = Array.from({ length: N + 1 }, () => []);
for (let i = 0; i < nodes.length - 2; i++) {
  const [a, b] = datas[i];
  edges[a].push(b);
  edges[b].push(a);
}
/** @type {[Node, number][]} */
const edgeQueue = [[null, 1]];
while (edgeQueue.length > 0) {
  const [parent, curIdx] = edgeQueue.pop();
  const curNode = nodes[curIdx];
  for (const childIdx of edges[curIdx]) {
    if (parent?.idx === childIdx) continue;

    const childNode = nodes[childIdx];
    curNode.addChild(childNode);
    edgeQueue.push([curNode, childIdx]);
  }
}

nodes[1].setDepth(0);

const M = datas.length - N;
const out = [];
for (let i = 0; i < M; i++) {
  let [nodeA, nodeB] = datas[i + N]
    .map(v => nodes[v])
    .sort((a, b) => a.depth - b.depth);
  
  const depthOffset = nodeB.depth - nodeA.depth;
  for (let i = 0; i < depthOffset; i++) {
    nodeB = nodeB.parent;
  }
  
  while (nodeA !== nodeB) {
    nodeA = nodeA.parent;
    nodeB = nodeB.parent;
  }
  out.push(nodeA.idx);
}

console.log(out.join("\n"));
