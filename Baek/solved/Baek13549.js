const isDev = process.platform !== "linux";
const input = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`5 99992
`
)
  .trim()
  .split("\n").map(line => line.split(" ").map(Number));

/** @type {[number, number]} */
const [N, K] = input.shift();

/** @type {number[]} */
const minCosts = Array(200001).fill(Infinity);
minCosts[N] = 0;
/** @type {boolean[]} */
const visited = Array(200001).fill(false);
visited[N] = true;

function genLines(n) {
  const avaiables = [
    [n, n*2, 0],
    [n, n+1, 1],
    [n, n-1, 1]
  ]
    .filter(([, v]) => !visited[v] && 0 < v && v <= 100000);

  return avaiables;
}

let minCost = Infinity;
let deck = [...genLines(N)];
while (deck.length > 0) {
  const [from, to, cost] = deck.shift();
  if (visited[to]) continue;
  const fromCost = minCosts[from];
  const costAcc = minCosts[to];

  if (from === K) {
    minCost = minCosts[from];
    continue;
  }
  if (fromCost > minCost) continue;

  minCosts[to] = Math.min(costAcc, fromCost + cost);
  const lines = genLines(to);
  for (const line of lines) {
    const cost = line[2];
    if (cost === 0) deck.unshift(line);
    else deck.push(line);
  }

  minCosts[K] = Math.min(minCosts[K], Math.abs(K - from) + fromCost, Math.abs(K - to) + minCosts[to]);
  minCost = Math.min(minCost, minCosts[K]);
  visited[to] = true;
}

console.log(minCosts[K]);
