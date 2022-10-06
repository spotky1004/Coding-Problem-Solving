const isDev = process.platform !== "linux";
const lines = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`2
5 4 2
1 2 3
1 2 6
2 3 2
3 4 4
3 5 3
5
4
6 9 2
2 3 1
1 2 1
1 3 3
2 4 4
2 5 5
3 4 3
3 6 2
4 5 4
4 6 3
5 6 7
5
6
`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

/**
 * @template T
 */
class Heap {
  /**
   * @typedef {(a: T, b: T) => boolean} CompareFn
   */
  
  /** @type {CompareFn} */
  compareFn = (a, b) => b - a;
  /** @type {number[]} */
  arr = [-1];
  /** @type {number} */
  size = 0;


  /**
   * @param {CompareFn} compareFn 
   */
  constructor(compareFn = (a, b) => b - a) {
    this.compareFn = compareFn;
  }

  /**
   * @param {number} value 
   */
  insert(value) {
    const size = ++this.size;
    const arr = this.arr;
    const compareFn = this.compareFn;
    arr.push(value);
    for (let i = size; i > 1; i = i >> 1) {
      const [cur, parent] = [arr[i], arr[i >> 1]];
      const compare = compareFn(cur, parent);
      if (compare >= 0) break;
      this.swap(i, i >> 1);
    }
  }

  /**
   * @param {T} i1 
   * @param {T} i2 
   */
  swap(i1, i2) {
    const arr = this.arr;
    [arr[i1], arr[i2]] = [arr[i2], arr[i1]];
  }

  /**
   * @returns {T | undefined}
   */
  delete() {
    if (this.size === 0) return undefined;
    const arr = this.arr;
    if (this.size === 1) {
      this.size--;
      return arr.pop();
    }
    const size = --this.size;

    const compareFn = this.compareFn;
    const returnVal = arr[1];
    arr[1] = arr.pop();
    let curIdx = 1;
    while (curIdx * 2 <= size) {
      const cur = arr[curIdx];
      const [leftIdx, rightIdx] = [curIdx * 2, curIdx * 2 + 1]
      const [childLeft, childRight] = [arr[leftIdx], arr[rightIdx]];
      let swapIdx = -1;
      if (leftIdx <= size && compareFn(childLeft, cur) < 0) swapIdx = leftIdx;
      if (
        swapIdx === -1 ?
          rightIdx < size && compareFn(childRight, cur) < 0 :
          leftIdx < size && compareFn(childRight, childLeft) < 0
      ) swapIdx = rightIdx;

      if (swapIdx === -1 || swapIdx > size) break;
      
      this.swap(curIdx, swapIdx);
      curIdx = swapIdx;
    }

    return returnVal;
  }
}

/**
 * @param {number} nodeCount 
 * @param {number} startNode 
 * @param {Map<number, number>[]} nodesMap 
 * @param {number} startCost
 * @returns {number[]}
 */
function dijkstra(nodeCount, startNode, nodesMap, startCost) {
  const costs = Array(nodeCount + 1).fill(Infinity);
  costs[startNode] = startCost;
  /** @type {Heap<[node: number, cost: number]>} */
  const heap = new Heap((a, b) => a[1] - b[1]);
  heap.insert([startNode, startCost]);
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

let output = "";
let i = 1;
while (i < lines.length) {
  const [n, m, t] = lines[i];
  i++;
  const [s, g, h] = lines[i];
  i++;

  let ghLineCost = -1;
  /** @type {Map<number, number>[]} */
  const nodesMap = Array(n + 1).fill().map(_ => new Map());
  for (let j = i; j < i + m; j++) {
    const [from, to, cost] = lines[j];
    if (
      (g === to || h === to) &&
      (g === from || h === from)
    ) {
      ghLineCost = cost;
      continue;
    }
    const nodeFrom = nodesMap[from];
    nodeFrom.set(to, Math.min(nodeFrom.get(to) ?? Infinity, cost));
    const nodeTo = nodesMap[to];
    nodeTo.set(from, Math.min(nodeTo.get(from) ?? Infinity, cost));
  }
  i += m;
  
  /** @type {number[]} */
  const goals = [];
  for (let j = i; j < i + t; j++) {
    goals.push(lines[j][0]);
  }
  i += t;

  const costs = dijkstra(n, s, nodesMap, 0);
  const gCost = costs[h] + ghLineCost;
  const hCost = costs[g] + ghLineCost;

  const gCosts = dijkstra(n, g, nodesMap, gCost);
  const hCosts = dijkstra(n, h, nodesMap, hCost);

  
  const avaiableGoals = [];
  for (const goal of goals) {
    const goalCost = Math.min(gCosts[goal], hCosts[goal]);
    if (
      (isFinite(costs[goal]) && costs[goal] < goalCost) ||
      (!isFinite(costs[goal]) && !isFinite(goalCost))
    ) continue;
    avaiableGoals.push(goal);
  }
  
  if (avaiableGoals.length === 0) continue;
  output += avaiableGoals.sort((a, b) => a - b).join(" ") + "\n";
}

console.log(output.trim());
