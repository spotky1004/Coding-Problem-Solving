const isDev = process.platform !== "linux";
const [[V], [K], ...rawLines] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`5 6
1
5 1 1
1 2 2
1 3 3
2 3 4
2 4 5
3 4 6`
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

/** @type {Map<number, number>[]} */
const nodesMap = Array(V + 1).fill().map(_ => new Map());
for (const [from, to, cost] of rawLines) {
  const nodeFrom = nodesMap[from];
  nodeFrom.set(to, Math.min(nodeFrom.get(to) ?? Infinity, cost));
}

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
console.log(costs.slice(1).map(c => !isFinite(c) ? "INF" : c).join("\n"));