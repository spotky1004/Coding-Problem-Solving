/**
 * @param {number} V 
 * @param {[a: number, b: number, cost: number]} edges 
 * @returns {number[][]} 
*/
function floydWarshall(V, edges) {
  const costs = Array.from({ length: V }, _ => Array(V).fill(Infinity));
  for (let i = 0; i < V; i++) costs[i][i] = 0;
  for (const [u, v, cost] of edges) costs[u][v] = cost;

  for (let k = 0; k < V; k++) {
    for (let u = 0; u < V; u++) {
      for (let v = 0; v < V; v++) costs[u][v] = Math.min(costs[u][v], costs[u][k] + costs[k][v]);
    }
  }
  return costs;
}
