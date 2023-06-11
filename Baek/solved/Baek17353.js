const isDev = process?.platform !== "linux";
const [[N], A, [Q], ...queries] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`5
1 2 1 2 1
4
1 1 3
2 4
1 1 3
2 4
`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

/**
 * @typedef {[l: number, r: number][]} LazyType
*/
/**
 * @template {any[]} T 
 * @template U 
*/
class LazySegmentTree {
  /**
   * @typedef {T} TreeType 
   * @typedef {LazyType[]} LazyTree
   * @typedef {T extends readonly (infer ElementType)[] ? ElementType : never} ElementType 
   * @typedef {(left: ElementType | U, right: ElementType | U) => ElementType} MergeFunc 
   * @typedef {(element: ElementType | U, index: number, s: number, e: number, ...params: any[]) => [newEl: ElementType, lazy: LazyType]} UpdateFunc 
   * @typedef {UpdateFunc[]} UpdateFuncs 
   * @typedef {(curLazy: LazyType | U, lazy: LazyType | U, idx: number, s: number, e: number) => ElementType} LazyMergeFunc 
   * @typedef {(element: ElementType | U, lazy: LazyType | U, index: number, s: number, e: number) => ElementType} LazyApplyFunc 
   */

  /** @type {number} */
  size = 0;
  /** @type {number} */
  height = 0;
  /** @type {TreeType} */
  tree = null;
  /** @type {LazyTree} */
  lazy = null;
  /** @type {ElementType} */
  defaultValue = null;
  /** @type {MergeFunc} */
  mergeFunc = null;
  /** @type {UpdateFuncs} */
  updateFuncs = [];
  /** @type {LazyMergeFunc} */
  lazyMergeFunc = null;
  /** @type {LazyApplyFunc} */
  lazyApplyFunc = null;

  /**
   * @param {T} values 
   * @param {U} defaultValue 
   * @param {MergeFunc} mergeFunc 
   * @param {UpdateFuncs} queryFuncs 
   * @param {LazyMergeFunc} lazyMergeFunc 
   * @param {LazyApplyFunc} lazyApplyFunc 
   */
  constructor(values, defaultValue, mergeFunc, queryFuncs, lazyMergeFunc, lazyApplyFunc) {
    this.size = values.length;
    this.height = Math.ceil(Math.log2(values.length)) + 1;
    this.mergeFunc = mergeFunc;
    this.updateFuncs = queryFuncs;
    this.lazyMergeFunc = lazyMergeFunc;
    this.lazyApplyFunc = lazyApplyFunc;
    
    this.defaultValue = defaultValue;
    this.tree = Array(1 << this.height).fill(this.defaultValue);
    this.lazy = Array(1 << this.height).fill(this.defaultValue);

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
   * @param {number} idx 
   * @param {number} s 
   * @param {number} e 
   */
  updateLazy(idx, s, e) {
    const curLazy = this.lazy[idx];
    if (curLazy === this.defaultValue) return;
    this.lazy[idx] = this.defaultValue;

    this.tree[idx] = this.lazyApplyFunc(this.tree[idx], curLazy, idx, s, e);
    if (s === e) return;
    const m = ((s + e) / 2) | 0;
    const l = idx * 2;
    const r = l + 1;
    this.lazy[l] = this.lazyMergeFunc(this.lazy[l], curLazy, l, s, m);
    this.lazy[r] = this.lazyMergeFunc(this.lazy[r], curLazy, r, m + 1, e);
  }

  /**
   * @param {number} type 
   * @param {number} idx 
   * @param  {...any} params 
   */
  update(type, idx, ...params) {
    this.updateRange(type, idx, idx, ...params);
  }

  /**
   * @param {number} type 
   * @param {number} l 
   * @param {number} r 
   * @param  {...any} params 
   */
  updateRange(type, l, r, ...params) {
    this.#updateRange(type, 1, 1, 1 << (this.height - 1), l, r, params);
  }

  /**
   * @param {number} type 
   * @param {number} idx 
   * @param {number} s 
   * @param {number} e 
   * @param {number} l 
   * @param {number} r 
   * @param {any[]} params 
   */
  #updateRange(type, idx, s, e, l, r, params) {
    this.updateLazy(idx, s, e);
    if (r < s || e < l) return;

    const m = ((s + e) / 2) | 0;
    const lIdx = idx * 2;
    const rIdx = lIdx + 1;

    if (l <= s && e <= r) {
      const [newEl, lazy] = this.updateFuncs[type](this.tree[idx], idx, s, e, ...params);
      this.tree[idx] = newEl;
      if (s === e) return;
      this.lazy[lIdx] = this.lazyMergeFunc(this.lazy[lIdx], lazy, lIdx, s, m);
      this.lazy[rIdx] = this.lazyMergeFunc(this.lazy[rIdx], lazy, rIdx, m + 1, e);
      return;
    }

    this.#updateRange(type, lIdx, s, m, l, r, params);
    this.#updateRange(type, rIdx, m + 1, e, l, r, params);
    this.tree[idx] = this.mergeFunc(this.tree[lIdx], this.tree[rIdx]);
  }

  /**
   * @param {number} l 
   * @param {number} r 
   * @returns {ElementType} 
   */
  sum(l, r) {
    if (l > r) [l, r] = [r, l];
    return this.#sum(1, 1, 1 << (this.height - 1), l, r);
  }

  /**
   * @param {number} idx 
   * @param {number} s 
   * @param {number} e 
   * @param {number} l 
   * @param {number} r 
   * @returns {ElementType} 
   */
  #sum(idx, s, e, l, r) {
    this.updateLazy(idx, s, e);
    if (r < s || e < l) return this.defaultValue;
    if (l <= s && e <= r) return this.tree[idx];

    const m = ((s + e) / 2) | 0;
    const lSum = this.#sum(idx * 2, s, m, l, r);
    const rSum = this.#sum(idx * 2 + 1, m + 1, e, l, r);
    return this.mergeFunc(lSum, rSum);
  }
}



const segTree = new LazySegmentTree(
  A.map((v, i) => A[i] - (A[i - 1] ?? 0)), 0,
  (left, right) => left + right,
  [
    (el, idx, s, e) => [el + (e - s + 1), 1],
    (el, idx, s, e, v) => [el + v, 0]
  ],
  (curLazy, lazy, s, e) => curLazy + lazy,
  (el, lazy, idx, s, e) => el + lazy * (e - s + 1)
);

const out = [];
for (const [type, p1, p2] of queries) {
  if (type === 1) {
    segTree.updateRange(0, p1, p2);
    if (p2 !== N) segTree.update(1, p2 + 1, -1 * (p2 - p1 + 1));
  } else if (type === 2) {
    out.push(segTree.sum(1, p1));
  }
}
console.log(out.join("\n"));
