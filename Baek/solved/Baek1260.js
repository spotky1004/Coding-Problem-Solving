const isDev = process?.platform !== "linux";
const [[N, M, V], ...edges] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`5 5 3
5 4
5 2
1 2
3 4
3 1`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const connections = Array.from({ length: N + 1 }, _ => []);
for (const [a, b] of edges) {
  connections[a].push(b);
  connections[b].push(a);
}
connections.map(v => v.sort((a, b) => a - b));



let visited = Array(N + 1).fill(false);
let order = [];

function dfs(node) {
  order.push(node);
  visited[node] = true;
  for (const toVisit of connections[node]) {
    if (visited[toVisit]) continue;
    dfs(toVisit);
  }
}
dfs(V);
console.log(order.join(" "));



visited = Array(N + 1).fill(false);
order = [];

const queue = [V];
visited[V] = true;
for (const node of queue) {
  order.push(node);
  for (const toVisit of connections[node]) {
    if (visited[toVisit]) continue;
    queue.push(toVisit);
    visited[toVisit] = true;
  }
}
console.log(order.join(" "));
