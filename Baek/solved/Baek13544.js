const isDev = process?.platform !== "linux";
const [[N], A, [M], ...queries] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`5
5 1 2 3 4
3
2 4 1
6 6 6
1 5 2`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

function upperBound(arr, v) {
  let left = -1, right = arr.length;
  while (left + 1 < right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] <= v) left = mid;
    else right = mid;
  }
  return right;
}

/**
 * @template T 
 */
class SegmentTree {
  /**
   * @typedef {T} TreeType 
   * @typedef {TreeType extends readonly (infer ElementType)[] ? ElementType : never} ElementType 
   * @typedef {(left: ElementType | null, right: ElementType | null) => ElementType} MergeFunc 
   * @typedef {(element: ElementType | null, ...params: any[]) => ElementType} UpdateFunc 
   * @typedef {UpdateFunc[]} UpdateFuncs 
   */

  /** @type {number} */
  size = 0;
  /** @type {number} */
  height = 0;
  /** @type {TreeType} */
  tree = null;
  /** @type {ElementType} */
  defaultValue = null;
  /** @type {MergeFunc} */
  mergeFunc = null;
  /** @type {UpdateFuncs} */
  updateFuncs = [];

  /**
   * @param {T} values 
   * @param {any} defaultValue 
   * @param {MergeFunc} mergeFunc 
   * @param {UpdateFuncs} queryFuncs
   */
  constructor(values, defaultValue, mergeFunc, queryFuncs) {
    this.size = values.length;
    this.height = Math.ceil(Math.log2(values.length)) + 1;
    this.mergeFunc = mergeFunc;
    this.updateFuncs = queryFuncs;

    this.defaultValue = defaultValue;
    this.tree = Array(1 << this.height).fill(this.defaultValue);

    const leafStartIdx = 1 << (this.height - 1);
    for (let i = 0; i < values.length; i++) {
      this.tree[i + leafStartIdx] = values[i];
    }

    for (let depth = this.height - 1; depth >= 1; depth--) {
      const startIdx = 1 << (depth - 1);
      for (let i = startIdx; i < 2 * startIdx; i++) {
        const leftEl = this.tree[i * 2];
        const rightEl = this.tree[i * 2 + 1];

        if (
          leftEl === this.defaultValue &&
          rightEl === this.defaultValue
        ) continue;
        this.tree[i] = this.mergeFunc(
          leftEl !== this.defaultValue ? leftEl : defaultValue,
          rightEl !== this.defaultValue ? rightEl : defaultValue
        );
      }
    }
  }

  /**
   * @param {number} type 
   * @param {number} idx 
   * @param  {...any} params 
   */
  update(type, idx, ...params) {
    const realIdx = (1 << (this.height - 1)) + idx - 1;
    this.tree[realIdx] = this.updateFuncs[type](
      this.tree[realIdx] !== this.defaultValue ? this.tree[realIdx] : null,
      ...params
    );

    for (let parentIdx = (realIdx / 2) | 0; parentIdx >= 1; parentIdx = (parentIdx / 2) | 0) {
      const leftEl = this.tree[parentIdx * 2];
      const rightEl = this.tree[parentIdx * 2 + 1];
      this.tree[parentIdx] = this.mergeFunc(
        leftEl !== this.defaultValue ? leftEl : null,
        rightEl !== this.defaultValue ? rightEl : null,
      );
    }
  }

  /**
   * @param {number} l 
   * @param {number} r 
   * @returns {ElementType} 
   */
  sum(l, r, k) {
    if (l > r) [l, r] = [r, l];
    return this.#sum(1, 1, 1 << (this.height - 1), l, r, k);
  }

  /**
   * @param {number} idx 
   * @param {number} s 
   * @param {number} e 
   * @param {number} l 
   * @param {number} r 
   * @returns {ElementType} 
   */
  #sum(idx, s, e, l, r, k) {
    if (r < s || e < l) return 0;
    if (l <= s && e <= r) return this.tree[idx].length - upperBound(this.tree[idx], k);

    const m = ((s + e) / 2) | 0;
    const lSum = this.#sum(idx * 2, s, m, l, r, k);
    const rSum = this.#sum(idx * 2 + 1, m + 1, e, l, r, k);
    return lSum + rSum;
  }
}

const segTree = new SegmentTree(
  A.map(v => [v]), null,
  (left, right) => left.concat(right).sort((a, b) => a - b),
  []
);

const out = [];
let lastAns = 0;
for (const [a, b, c] of queries) {
  const ans = segTree.sum(a ^ lastAns, b ^ lastAns, c ^ lastAns);
  out.push(ans);
  lastAns = ans;
}
console.log(out.join("\n"));
