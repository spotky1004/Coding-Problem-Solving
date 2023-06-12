const isDev = process?.platform !== "linux";
const [[N], ...datas] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`3
00:00:00 - 00:00:00
00:00:00 - 00:00:00
00:00:00 - 00:00:00
4
00:00:00 - 00:00:00
23:59:59 - 23:59:58
23:59:59 - 23:59:59
08:34:43 - 12:22:17`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(v => {
    if (!v.includes(":")) return Number(v);
    return v.split(":").reverse().reduce((a, b, i) => a + 60**i * b, 0) + 1;
  }));

/**
 * @typedef {number} LazyType
*/
/**
 * @template {any[]} T 
 * @template U 
*/
class LazySegmentTree {
  /**
   * @typedef {T} L_TreeType 
   * @typedef {LazyType[]} LazyTree
   * @typedef {T extends readonly (infer ElementType)[] ? ElementType : never} L_ElementType 
   * @typedef {(left: L_ElementType | U, right: L_ElementType | U) => L_ElementType} MergeFunc 
   * @typedef {(element: L_ElementType | U, index: number, s: number, e: number, ...params: any[]) => [newEl: L_ElementType, lazy: LazyType]} L_UpdateFunc 
   * @typedef {L_UpdateFunc[]} L_UpdateFuncs 
   * @typedef {(curLazy: LazyType | U, lazy: LazyType | U, idx: number, s: number, e: number) => L_ElementType} LazyMergeFunc 
   * @typedef {(element: L_ElementType | U, lazy: LazyType | U, index: number, s: number, e: number) => L_ElementType} LazyApplyFunc 
   */

  /** @type {number} */
  size = 0;
  /** @type {number} */
  height = 0;
  /** @type {L_TreeType} */
  tree = null;
  /** @type {LazyTree} */
  lazy = null;
  /** @type {L_ElementType} */
  defaultValue = null;
  /** @type {MergeFunc} */
  mergeFunc = null;
  /** @type {L_UpdateFuncs} */
  updateFuncs = [];
  /** @type {LazyMergeFunc} */
  lazyMergeFunc = null;
  /** @type {LazyApplyFunc} */
  lazyApplyFunc = null;

  /**
   * @typedef LazySegmentTreeOptions 
   * @property {T} values 
   * @property {U} defaultValue 
   * @property {MergeFunc} mergeFunc 
   * @property {L_UpdateFuncs} queryFuncs 
   * @property {LazyMergeFunc} lazyMergeFunc 
   * @property {LazyApplyFunc} lazyApplyFunc 
   */
  /**
   * @param {LazySegmentTreeOptions} options 
   */
  constructor(options) {
    const { values, defaultValue, mergeFunc, queryFuncs, lazyMergeFunc, lazyApplyFunc } = options;
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
   * @returns {L_ElementType} 
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
   * @returns {L_ElementType} 
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



const segTree = new LazySegmentTree({
  /** @type {number[]} */
  values: Array(86400).fill(0),
  defaultValue: 0,
  mergeFunc: (left, right) => left + right,
  queryFuncs: [
    (el, idx, s, e) => [el + (e - s + 1), 1]
  ],
  lazyMergeFunc: (curLazy, lazy) => curLazy + lazy,
  lazyApplyFunc: (el, lazy, idx, s, e) => el + lazy * (e - s + 1)
});

for (let i = 0; i < N; i++) {
  const [a, , b] = datas[i];
  if (a <= b) {
    segTree.updateRange(0, a, b);
  } else {
    segTree.updateRange(0, 1, b);
    segTree.updateRange(0, a, 86400);
  }
}

const out = [];
for (let i = N + 1; i < datas.length; i++) {
  const [a, , b] = datas[i];
  let o = 0;
  if (a <= b) {
    o += segTree.sum(a, b);
  } else {
    o += segTree.sum(1, b);
    o += segTree.sum(a, 86400);
  }
  const t = a <= b ? b - a + 1 : b + 86400 - a + 1;
  out.push(o / t);
}
console.log(out.join("\n"));
