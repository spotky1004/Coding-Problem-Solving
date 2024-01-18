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
