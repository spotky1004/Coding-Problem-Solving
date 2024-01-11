const isWeb = typeof window === "object";
const isDev = isWeb || require("fs").existsSync("C:/users/spotky");

if (!isDev) {
  const input = require("fs").readFileSync("/dev/stdin").toString();
  const out = solve(input);
  if (!isWeb) {
    process.stdout.write(out.toString());
    process.exit(0);
  } else {
    console.log(out);
  }
} else {
  if (!isWeb) require('node:v8').setFlagsFromString('--stack-size=65536');

  let CASE_NR = 1;
  function check(input, answer, caseName=`Case ${CASE_NR}`) {
    CASE_NR++;
    const startTime = new Date().getTime();
    const startMemory = !isWeb ? process.memoryUsage().heapUsed / 1024 : 0;
    const out = solve(input).toString().trim();
    const timeDeltaStr = (new Date().getTime() - startTime).toString();
    const timeDeltaZeroStr = " "+"0".repeat(6 - timeDeltaStr.length);
    const memoryDelta = ((!isWeb ? process.memoryUsage().heapUsed / 1024 : 0) - startMemory).toFixed(0);
    const memoryDeltaZeroStr = " "+"0".repeat(8 - memoryDelta.length);
    if (
      typeof answer === "string" ?
        out === answer :
        answer.includes(out)
    ) console.log("\x1b[1m%s\x1b[42m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[0m", `${caseName}: `, ` AC `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB");
    else console.log("\x1b[1m%s\x1b[41m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[31m%s\x1b[0m", `${caseName}: `, ` WA `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB\n", out.slice(0, 10000));
  }

// cases
check(`4
1 3
1 3
3 6
3 6`,
`2 2`);
check(`4
1 2
2 3
1 3
3 4`,
`3 2`);
check(`10
84 302
275 327
364 538
26 364
29 386
545 955
715 965
404 415
903 942
150 402`,
`6 5`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[n], ...lines] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
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

class Heap {
  tree = [null];
  compFunc = (a, b) => a - b;

  constructor(compFunc) {
    if (compFunc) this.compFunc = compFunc;
  }
  
  get size() {
    return this.tree.length - 1;
  }

  first() {
    return this.tree[1];
  }

  push(v) {
    const tree = this.tree;
    const compFunc = this.compFunc;

    let curIdx = tree.length;
    tree.push(v);
    while (curIdx !== 1) {
      const parentIdx = Math.floor(curIdx / 2);
      if (compFunc(v, tree[parentIdx]) >= 0) break;
      this.swap(curIdx, parentIdx);
      curIdx = parentIdx;
    }
  }

  pop() {
    const tree = this.tree;
    const compFunc = this.compFunc;
    if (tree.length === 1) return null;
    
    const popedNode = tree[1];
    if (tree.length === 2) {
      this.tree = [null];
      return popedNode;
    }
    
    const lastNode = tree.pop();
    tree[1] = lastNode;
    let curIdx = 1;
    while (true) {
      const childIdx = tree.length <= curIdx * 2 + 1 || compFunc(tree[curIdx * 2], tree[curIdx * 2 + 1]) <= 0 ? curIdx * 2 : curIdx * 2 + 1;
      if (
        tree.length <= childIdx ||
        compFunc(lastNode, tree[childIdx]) <= 0
      ) break;
      this.swap(curIdx, childIdx);
      curIdx = childIdx;
    }
    
    return popedNode;
  }

  swap(a, b) {
    const tmp = this.tree[b];
    this.tree[b] = this.tree[a];
    this.tree[a] = tmp;
  }
}



const rangeSumSegTree = new LazySegmentTree({
  values: Array(100000).fill(0),
  defaultValue: 0,
  queryFuncs: [
    (el, idx, s, e, v) => [el + v * (e - s + 1), v]
  ],
  mergeFunc: (l, r) => l + r,
  lazyApplyFunc: (el, lazy, idx, s, e) => el + lazy * (e - s + 1),
  lazyMergeFunc: (curLazy, lazy) => curLazy + lazy,
});

lines.sort((a, b) => a[0] - b[0]);
console.log(lines);

let op1 = 0;
let op2 = 0;
const endsHeap = new Heap((a, b) => a - b);
for (const [a, b] of lines) {
  rangeSumSegTree.updateRange(0, a, b - 1, 1);

  if (endsHeap.first() <= a) endsHeap.pop();
  endsHeap.push(b);
}

op1 = endsHeap.size;
console.log(endsHeap.tree);
for (let i = 1; i <= 100000; i++) {
  op2 = Math.max(op2, rangeSumSegTree.sum(i, i));
}

// output
return `${op1} ${op2}`;
}
