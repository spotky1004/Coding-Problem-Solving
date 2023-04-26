// @ts-nocheck

/** @type {Map<number, number>[]} */
const nodesMap = Array(V + 1).fill().map(_ => new Map());
for (const [from, to, cost] of rawLines) {
  const nodeFrom = nodesMap[from];
  nodeFrom.set(to, Math.min(nodeFrom.get(to) ?? Infinity, cost));
}

/**
 * @param {number} nodeCount 
 * @param {number} startNode 
 * @param {Map<number, number>[]} nodesMap 
 * @returns {number[]}
*/
function dijkstra(nodeCount, startNode, nodesMap) {
  const costs = Array(nodeCount + 1).fill(Infinity);
  costs[startNode] = 0;
  /** @type {Heap<[node: number, cost: number]>} */
  const heap = new Heap((a, b) => a[1] - b[1]);
  heap.insert([startNode, 0]);
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
