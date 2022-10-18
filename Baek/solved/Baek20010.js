const isDev = process.platform !== "linux";
const [[V], ...lines] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`6 7
0 1 5395
0 2 540
0 4 7096
1 2 1051
2 4 4750
3 4 9616
3 5 9476
`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const roots = Array.from({ length: V + 1 }, (_, i) => i);

/**
 * @param {number} a 
*/
function find(a) {
  if (roots[a] === a) return a;

  const root = find(roots[a]);
  roots[a] = root;
  return root;
}

/**
 * @param {number} a 
 * @param {number} b 
*/
function union(a, b){
  a = find(a);
  b = find(b);

  roots[b] = a;
}



void lines.sort((a, b) => a[2] - b[2]);

let costAcc = 0;
const nodesMap = Array(V + 1).fill().map(_ => new Map());
for (const [f, t, cost] of lines) {
  const from = f + 1;
  const to = t + 1;
  if (find(from) !== find(to)) {
    costAcc += cost;
    union(from, to);
    
    const nodeFrom = nodesMap[from];
    nodeFrom.set(to, Math.min(nodeFrom.get(to) ?? Infinity, cost));
    const nodeTo = nodesMap[to];
    nodeTo.set(from, Math.min(nodeTo.get(from) ?? Infinity, cost));
  }
}

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

const toCheck = [...new Set(roots.slice(1))];
let maxCost = -Infinity;
for (let i = 1; i <= V; i++) {
  maxCost = Math.max(maxCost, ...dijkstra(V, i, nodesMap).slice(1));
}
console.log(costAcc + "\n" + maxCost);
