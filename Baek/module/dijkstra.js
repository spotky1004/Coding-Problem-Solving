// @ts-nocheck

/** @type {Map<number, number>[]} */
const nodesMap = Array(V + 1).fill().map(_ => new Map());
for (const [from, to, cost] of rawLines) {
  const nodeFrom = nodesMap[from];
  nodeFrom.set(to, Math.min(nodeFrom.get(to) ?? Infinity, cost));
}

function dijkstra() {
  const costs = Array(V + 1).fill(Infinity);
  costs[K] = 0;
  /** @type {Heap<[node: number, cost: number]>} */
  const heap = new Heap((a, b) => a[1] - b[1]);
  heap.insert([K, 0]);
  while (heap.size > 0) {
    /** @type {number} */
    const [nodeNr, cost] = heap.delete();
    if (costs[nodeNr] < cost) continue;
    const node = nodesMap[nodeNr];
    for (const [curNr, curCost] of node) {
      if (costs[curNr] > cost + curCost) {
        costs[curNr] = cost + curCost;
        heap.insert([curNr, costs[curNr]]);
      }
    }
  }

  return costs;
}
