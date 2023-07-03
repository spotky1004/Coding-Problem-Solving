const isDev = process?.platform !== "linux";
const [[N], [E], ...edges] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`7
6
1 2
2 3
1 5
5 2
5 6
4 7`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const connections = Array.from({ length: N + 1 }, _ => []);
for (const [a, b] of edges) {
  connections[a].push(b);
  connections[b].push(a);
}

const queue = [1];
const visited = Array(N + 1).fill(false);
visited[1] = true;
for (const n of queue) {
  for (const toCheck of connections[n]) {
    if (visited[toCheck]) continue;
    visited[toCheck] = true;
    queue.push(toCheck);
  }
}

console.log(queue.length - 1);
