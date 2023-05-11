const isDev = process?.platform !== "linux";
const [[N], ...datas] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`7
1 6 13
6 3 9
3 5 7
4 1 3
2 4 20
4 7 2
3
1 6
1 4
2 6`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const nodeConnections = Array.from({ length: N + 1 }, _ => []);
const edgeDistances = Array.from({ length: N + 1 }, _ => []);
for (const [a, b, dist] of datas.splice(0, N - 1)) {
  nodeConnections[a].push(b);
  nodeConnections[b].push(a);
  edgeDistances[a].push(dist);
  edgeDistances[b].push(dist);
}

const nodeParents = Array(N + 1).fill(-1);
const nodeDepths = Array(N + 1).fill(-1);
const nodeDistances = Array(N + 1).fill(-1);
function init(curNode = 1, parentNode = -1, distanceAcc = 0, depth = 1) {
  nodeParents[curNode] = parentNode;
  nodeDepths[curNode] = depth;
  nodeDistances[curNode] = distanceAcc;

  const connections = nodeConnections[curNode];
  for (let i = 0; i < connections.length; i++) {
    const childNode = connections[i];
    if (childNode === parentNode) continue;

    const distance = distanceAcc + edgeDistances[curNode][i];
    init(childNode, curNode, distance, depth + 1);
  }
}
init();

const M = datas.shift()[0];
const out = [];
for (const [from, to] of datas) {
  let fromDepth = nodeDepths[from];
  let toDepth = nodeDepths[to];
  let curFromNode = from;
  let curToNode = to;

  while (true) {
    if (curFromNode === curToNode) break;

    if (fromDepth > toDepth) {
      fromDepth--;
      curFromNode = nodeParents[curFromNode];
    } else if (fromDepth < toDepth) {
      toDepth--;
      curToNode = nodeParents[curToNode];
    } else {
      fromDepth--;
      toDepth--;
      curFromNode = nodeParents[curFromNode];
      curToNode = nodeParents[curToNode];
    }
  }

  const fromDist = nodeDistances[from];
  const toDist = nodeDistances[to];
  const centerDist = nodeDistances[curFromNode];
  out.push(fromDist + toDist - 2 * centerDist);
}

console.log(out.join("\n"));
