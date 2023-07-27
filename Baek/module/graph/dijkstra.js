function dijkstra(nodeCount, startNode) {
  const costs = Array(nodeCount + 1).fill(Infinity);
  costs[startNode] = 0;
  
  const heap = new Heap((a, b) => a[1] - b[1]);
  heap.push([startNode, 0]);

  while (heap.size > 0) {
    const [nodeNr, cost] = heap.pop();
    if (costs[nodeNr] < cost) continue;
    const node = connections[nodeNr];
    for (const [curNr, curCost] of node) {
      if (costs[curNr] < cost + curCost) continue;
      costs[curNr] = cost + curCost;
      heap.push([curNr, costs[curNr]]);
    }
  }

  return costs;
}
