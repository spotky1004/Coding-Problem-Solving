const isDev = process?.platform !== "linux";
const [[N], ...queries] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`6
1 1 10 1000
2 1 6 2
1 2 9 -40
2 6 10 3
2 3 11 1
1 4 11 400`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(BigInt));

/**
 * @template T 
 * @template U 
 */
class SegmentTree {
  /**
   * @typedef {T} TreeType 
   * @typedef {TreeType extends readonly (infer ElementType)[] ? ElementType : never} ElementType 
   * @typedef {(left: ElementType | U, right: ElementType | U) => ElementType} MergeFunc 
   * @typedef {(element: ElementType | U, ...params: any[]) => ElementType} UpdateFunc 
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
   * @typedef SegmentTreeOptions 
   * @property {T} values 
   * @property {U} defaultValue 
   * @property {MergeFunc} mergeFunc 
   * @property {UpdateFuncs} queryFuncs
   */
  /**
   * @param {SegmentTreeOptions} options 
   */
  constructor(options) {
    const { values, queryFuncs, mergeFunc, defaultValue } = options;
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
    if (r < s || e < l) return this.defaultValue;
    if (l <= s && e <= r) return this.tree[idx];

    const m = ((s + e) / 2) | 0;
    const lSum = this.#sum(idx * 2, s, m, l, r);
    const rSum = this.#sum(idx * 2 + 1, m + 1, e, l, r);
    return this.mergeFunc(
      lSum !== this.defaultValue ? lSum : null,
      rSum !== this.defaultValue ? rSum : null
    );
  }
}

/**
 * @typedef {bigint} LazyType
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

function binSearch(arr, v) {
  let left = 0, right = arr.length;
  while (left + 1 < right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === v) return mid;
    else if (arr[mid] < v) left = mid;
    else right = mid;
  }
  return left;
}



let points = [];
for (const [, i, j] of queries) {
  points.push(i, j);
}
points = [...new Set(points)].sort((a, b) => Number(a - b));
const rawRanges = [];
for (let i = 0; i < points.length; i++) {
  const [cur, prev] = [points[i], points[i - 1]];
  if (i !== 0 && cur - prev > 2n) {
    rawRanges.push([prev + 1n, cur - 1n]);
  }
  rawRanges.push([cur, cur]);
}
const ranges = [];
let watchingPoint = 0n;
for (const [s, e] of rawRanges) {
  if (s > watchingPoint + 1n) {
    ranges.push([watchingPoint + 1n, s - 1n]);
  }
  ranges.push([s, e]);
  watchingPoint = e;
}

const rangeLengths = [];
const rangeStarts = [];
const rangeEnds = [];
for (let i = 0; i < ranges.length; i++) {
  const [a, b] = ranges[i];
  rangeLengths.push(b - a + 1n);
  rangeStarts.push(a);
  rangeEnds.push(b);
}

function calcRange(i, j) {
  return [binSearch(rangeStarts, i) + 1, binSearch(rangeEnds, j) + 1];
}

const weightSegTree = new SegmentTree({
  values: rangeLengths,
  defaultValue: 0n,
  mergeFunc: (left, right) => left + right,
  queryFuncs: []
}).tree;

const sumSegTree = new LazySegmentTree({
  values: Array(rangeLengths.length).fill(0n),
  defaultValue: 0n,
  mergeFunc: (left, right) => left + right,
  queryFuncs: [
    (el, idx, s, e, k) => [el + k * weightSegTree[idx], k]
  ],
  lazyMergeFunc: (curLazy, lazy) => curLazy + lazy,
  lazyApplyFunc: (el, lazy, idx, s, e) => el + lazy * weightSegTree[idx]
});

const updateQueries = [];
const outQueries = [];
for (const query of queries) {
  const type = query[0];
  if (type === 1n) {
    updateQueries.push(query);
  } else if (type === 2n) {
    outQueries.push([query, outQueries.length]);
  }
}
outQueries.sort((a, b) => Number(a[0][3] - b[0][3]));

const out = Array(outQueries.length);
let updateIdx = -1;
for (let [[, i, j, k], idx] of outQueries) {
  k = Number(k);
  while (updateIdx < k - 1) {
    const [, ui, uj, uk] = updateQueries[updateIdx + 1];
    sumSegTree.updateRange(0, ...calcRange(ui, uj), uk);
    updateIdx++;
  }
  out[idx] = sumSegTree.sum(...calcRange(i, j));
}
console.log(out.join("\n"));
