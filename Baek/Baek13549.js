const isDev = process.platform !== "linux";
const input = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`5 4567
`
)
  .trim()
  .split("\n").map(line => line.split(" ").map(Number));

/** @type {[number, number]} */
const [N, K] = input.shift();

/** @type {number[]} */
const minCosts = Array(100001).fill(Infinity);
minCosts[N] = 0;
/** @type {boolean[]} */
const visited = Array(100001).fill(false);
visited[N] = true;

function genQueues(n) {
  const avaiables = [
    [n, n*2, 0],
    [n, n+1, 1],
    [n, n-1, 1]
  ]
    .filter(([, v]) => !visited[v] && 0 < v && v <= 100000);

  return avaiables;
}

let minCost = Infinity;
let queue = [...genQueues(N)];
while (queue.length > 0) {
  const [from, to, cost] = queue.shift();
  if (visited[to]) continue;

  if (from === K) {
    minCost = minCosts[from];
    continue;
  }
  if (minCosts[to] > minCost) continue;

  const fromCost = minCosts[from];
  minCosts[to] = Math.min(minCosts[to], fromCost + cost);
  queue.push(...genQueues(to));
  queue.sort((a, b) => a[2] - b[2]);

  visited[to] = true;
}

console.log(minCosts, minCosts[K]);
