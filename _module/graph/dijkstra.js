/**
 * @param {number} V 
 * @param {number} s 
 * @param {[v: number, cost: number][]} adj 
 */
function dijkstra(V, s, adj) {
  const costs = Array(V).fill(Infinity);
  costs[s] = 0;
  
  const heap = new Heap((a, b) => a[1] - b[1]);
  heap.push([s, 0]);

  while (heap.size > 0) {
    const [u, cost] = heap.pop();
    if (costs[u] < cost) continue;
    const node = adj[u];
    for (const [v, costAdd] of node) {
      if (costs[v] <= cost + costAdd) continue;
      costs[v] = cost + costAdd;
      heap.push([v, costs[v]]);
    }
  }

  return costs;
}
