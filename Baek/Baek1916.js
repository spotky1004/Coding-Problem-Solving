const isDev = process.platform !== "linux";
const input = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`7
12
1 2 7
1 5 3
1 6 10
5 2 2
2 6 6
2 3 4
2 4 10
5 7 5
5 4 11
3 4 2
6 4 9
7 4 4
1 4`
)
  .trim()
  .split("\n").map(line => line.split(" ").map(Number));

const N = input.shift()[0];
const M = input.shift()[0];
/** @type {boolean[]} */
const completed = Array(N+1).fill(false);
/** @type {Map<number, number>[]} */
const lines = Array.from({ length: N+1 }, _ => new Map());
for (const nodeData of input.splice(0, M)) {
  const [from, to, cost] = nodeData;
  const prevCost = lines[from].get(to) ?? Infinity;
  lines[from].set(to, Math.min(prevCost, cost));
}

/** @type {[number, number]} */
const [startNodeNr, endNodeNr] = input.shift();
/** @type {number[]} */
const minimumCosts = Array.from({ length: N+1 }).fill().map((_, i) => lines[startNodeNr].get(i) ?? Infinity);
minimumCosts[startNodeNr] = 0;

/** @type {[from: number, to: number][]} */
completed[startNodeNr] = true;
while (true) {
  const nodeToCheck = minimumCosts.reduce(([minNodeNr, minCost], cost, nr) => {
    const isMinNode = completed[nr] === false && cost < minCost;
    return isMinNode ? [nr, cost] : [minNodeNr, minCost];
  }, [-1, Infinity])[0];
  if (nodeToCheck === -1) break;
  
  const baseCost = minimumCosts[nodeToCheck];
  const nodeLines = lines[nodeToCheck];
  for (const [nodeToNr, cost] of nodeLines) {
    minimumCosts[nodeToNr] = Math.min(baseCost + cost, minimumCosts[nodeToNr]);
  }
  
  completed[nodeToCheck] = true;
}

console.log(minimumCosts[endNodeNr]);
