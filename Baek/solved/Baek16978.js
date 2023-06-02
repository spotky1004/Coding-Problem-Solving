const isDev = process?.platform !== "linux";
const [[N], A, [M], ...queries] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`5
1 2 3 4 5
7
1 2 5
2 0 1 3
2 1 1 3
1 4 2
2 0 2 5
2 1 2 5
2 2 2 5`
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
    if (left > right) [left, right] = [right, left];
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
  A,
  (left, right) => (left ?? 0) + (right ?? 0)
);

const query1 = [];
const query2 = [];
for (let i = 0; i < queries.length; i++) {
  const query = queries[i];
  if (query[0] === 1) {
    query1.push(query);
  } else {
    query2.push([...query, query2.length]);
  }
}
query2.sort((a, b) => a[1] - b[1]);

const out = Array(query2.length);
let i = 0;
for (const [, a, b, c, idx] of query2) {
  while (a > i) {
    segTree.update(query1[i][1], query1[i][2]);
    i++;
  }
  out[idx] = segTree.sum(b, c);
}
console.log(out.join("\n"));
