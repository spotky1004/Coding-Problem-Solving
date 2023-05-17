const isDev = process?.platform !== "linux";
const [[V, E], ...edges] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`7 9
1 2
2 1
2 3
3 2
3 1
1 3`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const nodeConnections = Array.from({ length: V + 1 }, _ => []);
for (const [from, to] of edges) {
  nodeConnections[from].push(to);
}
nodeConnections.map(v => v.sort((a, b) => a - b))

const finished = Array(V + 1).fill(false);
let idAcc = 1;
const sccId = Array(V + 1).fill(0);
const SCC = [];
const sccStack = [];
function searchSCC(curNode) {
  const curId = idAcc;
  sccId[curNode] = curId;
  idAcc++;
  sccStack.push(curNode);

  const curConnections = nodeConnections[curNode];
  for (const to of curConnections) {
    if (finished[to] || to === curNode) continue;
    if (sccId[to] !== 0) {
      sccId[curNode] = Math.min(sccId[curNode], sccId[to]);
    } else {
      const toSearch = searchSCC(to);
      if (toSearch !== -1) {
        sccId[curNode] = Math.min(sccId[curNode], sccId[to]);
      }
    }
  }
  if (curId !== sccId[curNode]) {
    return sccId[curNode];
  }

  const newSCC = [];
  while (newSCC[newSCC.length - 1] !== curNode) {
    const toPush = sccStack.pop();
    finished[toPush] = true;
    newSCC.push(toPush);
  }
  newSCC.sort((a, b) => a - b);
  SCC.push(newSCC);
  return -1;
}
for (let i = 1; i <= V; i++) {
  if (finished[i]) continue;
  searchSCC(i);
}

SCC
  .sort((a, b) => a[0] - b[0])
  .map(v => {
    v.push(-1);
    return v;
  })
console.log(SCC.length + "\n" + SCC.map(v => v.join(" ")).join("\n"));
