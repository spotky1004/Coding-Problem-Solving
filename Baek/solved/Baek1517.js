const isDev = process?.platform !== "linux";
const [[N], A] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`5
2 3 5 1 4`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

/**
 * @template {any} T 
*/
class SegmentTree {
  /** @typedef {(left: (null | T), right: (null | T)) => T} SumFunc */

  /** @type {number} */
  height = 0;
  /** @type {(null | T)[]} */
  tree = [null];
  /** @type {SumFunc} */
  sumFunc = (left, right) => (left ?? 0) + (right ?? 0);


  /**
   * @param {T[]} arr 
   * @param {SumFunc} sumFunc 
   */
  constructor(arr, sumFunc) {
    if (sumFunc) this.sumFunc = sumFunc;

    this.height = Math.ceil(Math.log2(arr.length)) + 1;
    this.tree = Array(1 << this.height).fill(null);

    let tmp = 1 << (this.height - 1);
    for (let i = 0; i < arr.length; i++) {
      this.tree[i + tmp] = arr[i];
    }

    for (let d = this.height - 1; d >= 1; d--) {
      const start = 1 << (d - 1);

      for (let i = start; i < 2 * start; i++) {
        const left = this.tree[i * 2];
        const right = this.tree[i * 2 + 1];

        if (
          left === null &&
          right === null
        ) continue;

        this.tree[i] = this.sumFunc(left, right);
      }
    }
  }

  /**
   * @param {number} idx 
   * @param {T} data 
   */
  update(idx, data) {
    const leafIdx = (1 << (this.height - 1)) + idx - 1;
    this.tree[leafIdx] = data;

    for (let idx = Math.floor(leafIdx / 2); idx >= 1; idx = Math.floor(idx / 2)) {
      this.tree[idx] = this.sumFunc(
        this.tree[idx * 2],
        this.tree[idx * 2 + 1]
      );
    }
  }
  
  /**
   * @param {number} left 
   * @param {number} right 
   */
  sum(left, right) {
    return this.#sum(1, 1, 1 << (this.height - 1), left, right);
  }

  /**
   * @param {number} start 
   * @param {number} end 
   * @param {number} left 
   * @param {number} right 
   */
  #sum(idx, start, end, left, right) {
    if (right < start || end < left) {
      return null;
    } else if (left <= start && end <= right) {
      return this.tree[idx];
    }

    const halfLen = (end - start + 1) / 2;
    return this.sumFunc(
      this.#sum(idx * 2, start, start + halfLen - 1, left, right),
      this.#sum(idx * 2 + 1, start + halfLen, end, left, right)
    );
  }
}

const segTree = new SegmentTree(
  /** @type {number[]} */
  Array(N).fill(0),
  (left, right) => (left ?? 0) + (right ?? 0)
);

let swapCount = 0;
const sorted = A.map((v, i) => [v, i + 1]).sort((a, b) => a[0] - b[0]);
for (let i = 0; i < N; i++) {
  const origIdx = sorted[i][1];

  swapCount += segTree.sum(origIdx + 1, N);
  segTree.update(origIdx, 1);
}

console.log(swapCount);
