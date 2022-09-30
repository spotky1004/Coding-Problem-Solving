const isDev = process.platform !== "linux";
const input = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`4 5
50 45 37 32 30
35 50 40 20 25
30 30 25 17 28
27 24 22 15 10
`
)
  .trim()
  .split("\n").map(line => line.split(" ").map(Number));

class Heap {
  /**
   * @typedef {(a: number, b: number) => boolean} CompareFn
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
   * @param {number} i1 
   * @param {number} i2 
   */
  swap(i1, i2) {
    const arr = this.arr;
    [arr[i1], arr[i2]] = [arr[i2], arr[i1]];
  }

  /**
   * @returns {number | undefined}
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

const [M, N] = input.shift();
const board = input;
const dpBoard = Array(M).fill().map(_ => Array(N).fill(0));
dpBoard[0][0] = 1;

const heap = new Heap(([ax, ay], [bx, by]) => board[by][bx] - board[ay][ax]);
for (let y = 0; y < M; y++) {
  for (let x = 0; x < N; x++) {
    heap.insert([x, y]);
  }
}

const directions = [
  [-1, 0], [1, 0],
  [0, -1], [0, 1]
];
while (heap.size > 0) {
  const [x, y] = heap.delete();
  const dpValue = dpBoard[y][x];
  const tileValue = board[y][x];
  for (const [dx, dy] of directions) {
    const [tx, ty] = [x + dx, y + dy];
    if (
      0 > tx || tx >= N ||
      0 > ty || ty >= M
    ) continue;
    const tileToCompare = board[ty][tx];
    if (tileToCompare >= tileValue) continue;
    dpBoard[ty][tx] += dpValue;
  }
  if (isDev) {
    console.log(heap.arr.slice(1).map(([x, y]) => board[y][x]), dpBoard);
  }
}
console.log(dpBoard[M - 1][N - 1]);
