const isDev = process?.platform !== "linux";
const [[N], ...edges] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`38
1 2
2 3
3 4
4 5
5 6
6 1
1 7
7 8
8 9
9 10
10 11
11 12
12 13
13 14
14 15
15 16
16 17
17 18
18 19
19 20
20 21
21 22
22 23
23 24
24 25
25 26
26 27
27 28
28 29
29 30
30 31
31 32
32 33
33 34
34 35
35 36
36 37
37 38`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const vertexConnections = Array.from({ length: N + 1 }, () => []);
for (const [a, b] of edges) {
  vertexConnections[a].push(b);
  vertexConnections[b].push(a);
}

function searchLoop(startIdx, idx = startIdx, visited = Array(N + 1).fill(false), depth = 0) {
  visited[idx] = true;
  
  for (const toVisit of vertexConnections[idx]) {
    if (
      startIdx === toVisit &&
      depth !== 1
    ) return true;
    if (visited[toVisit]) continue;
    
    const result = searchLoop(startIdx, toVisit, visited, depth + 1);
    if (result) {
      return true;
    }
  }

  return false;
}

const loopVertexes = [];
for (let i = 1; i <= N; i++) {
  const isLoop = searchLoop(i);
  if (isLoop) loopVertexes.push(i);
}

const minLoopDist = Array(N + 1).fill(Infinity);
function searchMinLoopDist(idx, visited = Array(N + 1).fill(false), depth = 0) {
  visited[idx] = true;
  minLoopDist[idx] = Math.min(minLoopDist[idx], depth);

  for (const toVisit of vertexConnections[idx]) {
    if (visited[toVisit]) continue;
    searchMinLoopDist(toVisit, visited, depth + 1);
  }
}

for (const loopVertex of loopVertexes) {
  searchMinLoopDist(loopVertex);
}

console.log(minLoopDist.slice(1).join(" "));
