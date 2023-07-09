const isDev = process?.platform !== "linux";
const [[N, M], ...edges] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`6 8
1 2
2 5
5 1
3 4
4 6
5 4
2 4
2 3`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const connections = Array.from({ length: N + 1 }, () => []);
for (const [a, b] of edges) {
  connections[a].push(b);
  connections[b].push(a);
}

let count = 0;
const visited = Array(N + 1).fill(false);
for (let i = 1; i <= N; i++) {
  if (visited[i]) continue;

  const queue = [i];
  visited[i] = true;

  for (const node of queue) {
    for (const toVisit of connections[node]) {
      if (visited[toVisit]) continue;
      queue.push(toVisit);
      visited[toVisit] = true;
    }
  }

  count++;
}
console.log(count);
