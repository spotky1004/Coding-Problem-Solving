/**
 * @param {number} V 
 * @param {[a: number, b: number, cost: number]} connections 
 * @returns {number[][]} 
 */
function floydWarshall(V, connections) {
  const costs = Array.from({ length: V }, _ => Array(V).fill(Infinity));
  for (let i = 0; i < V; i++) {
    costs[i][i] = 0;
  }
  for (const [a, b, cost] of connections) {
    costs[a - 1][b - 1] = cost;
    costs[b - 1][a - 1] = cost;
  }

  for (let k = 0; k < V; k++) {
    for (let i = 0; i < V; i++) {
      for (let j = 0; j < V; j++) {
        const newCost = Math.min(costs[i][j], costs[i][k] + costs[k][j]);
        costs[i][j] = newCost;
        costs[j][i] = newCost;
      }
    }
  }
  return costs;
}