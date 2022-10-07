const isDev = process.platform !== "linux";
const [[N, M], ...lines] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`2 3
1 2 3
1 2 2
1 2 1`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

/**
 * @param {number} nodeCount 
 * @param {number} startNode 
 * @param {[from: number, to: number, cost: number][]} lines 
 * @returns {-1 | number[]}
*/
function bellmanFord(nodeCount, startNode, lines) {
  const costs = Array(nodeCount + 1).fill().map(_ => [Infinity, Infinity]);
  costs[startNode][0] = 0;
  for (let i = 0; i < nodeCount + 1; i++) {
    for (const [from, to, cost] of lines) {
      costs[to][1] = Math.min(costs[to][1], costs[from][0] + cost);
    }
    if (i !== nodeCount) {
      for (let i = 0; i < costs.length; i++) {
        costs[i][0] = costs[i][1];
      }
    } else {
      for (let i = 0; i < costs.length; i++) {
        if (costs[i][0] !== costs[i][1]) return -1;
      }
    }
  }

  return costs.map(c => c[0]);
}

const costs = bellmanFord(N, 1, lines);
console.log(costs === -1 ? "-1" : costs.slice(2).map(v => isFinite(v) ? v : -1).join("\n"));
