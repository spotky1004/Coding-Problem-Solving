const isDev = process?.platform !== "linux";
const [[T], ...lines] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`1
3 6
2 1 3
1 2 5`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

class Node {
  /** @type {number} */
  n
  /** @type {Node[]} */
  connections = [];

  constructor(n) {
    this.n = n;
  }
  
  /**
   * @param {Node} node 
   */
  addConnection(node) {
    if (this.connections.includes(node)) return;
    this.connections.push(node);
    node.connections.push(this);
  }

  removeNode() {
    [...this.connections].map(node => node.removeConnection(this));
    this.connections = [];
  }

  /**
   * @param {Node} node 
   */
  removeConnection(node) {
    const idx = this.connections.findIndex(n => n === node);
    if (idx === -1) return;
    this.connections.splice(idx, 1);
    node.removeConnection(this);
  }
}

const out = [];
let line = 0;
while (line < lines.length) {
  const [N, W] = lines[line];
  line++;
  const enemies = lines.slice(line, line + 2).flat();
  line += 2;

  const V = N * 2;

  const nodes = Array.from({ length: V }, (_, i) => new Node(i));
  for (let i = 0; i < V; i++) {
    const rightIdx = i < N ? (i + 1) % N: (i + 1 - N) % N + N;
    const downIdx = i + N;
    
    const curValue = enemies[i];
    const rightValue = enemies[rightIdx];
    const downValue = enemies[downIdx] ?? Infinity;

    if (curValue + rightValue <= W) {
      nodes[i].addConnection(nodes[rightIdx]);
    }
    if (curValue + downValue <= W) {
      nodes[i].addConnection(nodes[downIdx]);
    }
  }

  let visited = Array(V).fill(false);
  /** @type {Node[][]} */
  const chunks = [];
  function searchChunk(curIdx, chunk = []) {
    const curNode = nodes[curIdx];
    visited[curIdx] = true;
    chunk.push(curNode);

    for (const connection of curNode.connections) {
      const connectionIdx = connection.n;
      if (visited[connectionIdx]) continue;
      searchChunk(connectionIdx, chunk);
    }

    return chunk;
  }
  for (let i = 0; i < V; i++) {
    if (visited[i]) continue;
    const chunk = searchChunk(i);
    chunks.push(chunk);
  }

  let launchCount = 0;
  visited = Array(V).fill(false);
  function launchSearch(curIdx) {
    const node = nodes[curIdx];

    visited[node.n] = true;
    for (const connection of node.connections) {
      if (visited[connection.n]) continue;
      visited[connection.n] = true;
      launchCount++;
      node.removeNode();
      connection.removeNode();
      return 2;
    }
    launchCount++;
    node.removeNode();
    return 1;
  }

  for (const chunk of chunks) {
    let connectedNode = 0;
    while (connectedNode < chunk.length) {
      let nodeToSearch = null;
      let minConnecitonCount = Infinity;
      for (const node of chunk) {
        if (visited[node.n]) continue;
        const connectionCount = node.connections.length;
        if (connectionCount < minConnecitonCount) {
          nodeToSearch = node;
          minConnecitonCount = connectionCount;
        }
      }

      connectedNode += launchSearch(nodeToSearch.n);
    }
  }

  out.push(launchCount);
}

console.log(out.join("\n"));
